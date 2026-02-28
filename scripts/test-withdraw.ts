/**
 * End-to-end test for the PunkZK Vault withdraw flow.
 * 
 * This script:
 * 1. Connects to a local Solana validator (must be running with the program deployed)
 * 2. Initializes a fresh privacy pool
 * 3. Deposits 0.1 SOL with a known commitment
 * 4. Generates a real Groth16 ZK proof using snarkjs
 * 5. Submits a withdraw transaction with the proof
 * 6. Verifies the on-chain state
 * 
 * Usage:
 *   npx tsx scripts/test-withdraw.ts
 * 
 * Prerequisites:
 *   - solana-test-validator running with the program deployed
 *   - Circuit files at ../punkzk-vault/circuits/
 */

import {
  Connection, Keypair, PublicKey, Transaction, TransactionInstruction,
  SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import { poseidon1, poseidon2 } from "poseidon-lite";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// Constants
// =============================================================================
const PROGRAM_ID = new PublicKey("5RnAtgkezoRF4WC4zVA2dPPGCxc91vBeMfAN3mbsobTn");

// Anchor instruction discriminators (first 8 bytes of sha256("global:<method_name>"))
const IX_INITIALIZE = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
const IX_DEPOSIT    = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182]);
const IX_WITHDRAW   = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34]);

const FR_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const BN254_P    = BigInt("21888242871839275222246405745257275088696311157297823662689037894645226208583");

const CIRCUITS_DIR = path.resolve(__dirname, "../../punkzk-vault/circuits");
const WASM_PATH = path.join(CIRCUITS_DIR, "withdraw_js/withdraw.wasm");
const ZKEY_PATH = path.join(CIRCUITS_DIR, "withdraw.zkey");

// =============================================================================
// Helper Functions
// =============================================================================
function randomBytes(length = 31): Buffer {
  const bytes = Buffer.alloc(length);
  for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return bytes;
}

function bufferToBigIntLE(buf: Buffer): bigint {
  let hex = buf.toString("hex");
  let rev = "";
  for (let i = hex.length - 2; i >= 0; i -= 2) rev += hex.slice(i, i + 2);
  return BigInt("0x" + (rev || "0"));
}

function bigIntToBufferLE(bigint: bigint): Buffer {
  let hex = bigint.toString(16).padStart(64, "0");
  let buf = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    buf[i] = parseInt(hex.slice((31 - i) * 2, (31 - i) * 2 + 2), 16);
  }
  return buf;
}

function serializeU64(value: number | bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(value));
  return buf;
}

function serializeU8(value: number): Buffer {
  return Buffer.from([value]);
}

function serializeVecU8(data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32LE(data.length);
  return Buffer.concat([len, data]);
}

function serializeBytes32(data: Buffer): Buffer {
  if (data.length !== 32) throw new Error("Expected 32 bytes");
  return Buffer.from(data);
}

function to32BytesBE(hexStr: string): Buffer {
  const padded = hexStr.padStart(64, "0");
  return Buffer.from(padded, "hex");
}

function packG1(g1: string[]): Buffer {
  const x = BigInt(g1[0]);
  const y = BigInt(g1[1]);
  return Buffer.concat([to32BytesBE(x.toString(16)), to32BytesBE(y.toString(16))]);
}

function packG1Negated(g1: string[]): Buffer {
  const x = BigInt(g1[0]);
  const y = BigInt(g1[1]);
  const neg_y = BN254_P - y;
  return Buffer.concat([to32BytesBE(x.toString(16)), to32BytesBE(neg_y.toString(16))]);
}

function packG2(g2: string[][]): Buffer {
  const x0 = BigInt(g2[0][0]);
  const x1 = BigInt(g2[0][1]);
  const y0 = BigInt(g2[1][0]);
  const y1 = BigInt(g2[1][1]);
  return Buffer.concat([
    to32BytesBE(x1.toString(16)),
    to32BytesBE(x0.toString(16)),
    to32BytesBE(y1.toString(16)),
    to32BytesBE(y0.toString(16))
  ]);
}

// =============================================================================
// Merkle Tree (matching on-chain logic)
// =============================================================================
function buildMerkleProof(
  commitmentBigInt: bigint,
  leafIndex: number,
  allLeaves: bigint[],
  height: number
): { pathElements: bigint[]; pathIndices: number[]; root: bigint } {
  const numLeaves = 2 ** height;
  const leaves: bigint[] = new Array(numLeaves).fill(BigInt(0));
  for (let i = 0; i < allLeaves.length; i++) leaves[i] = allLeaves[i];

  let currentLayer = leaves;
  const pathElements: bigint[] = [];
  const pathIndices: number[] = [];
  let idx = leafIndex;

  for (let level = 0; level < height; level++) {
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    pathElements.push(currentLayer[siblingIdx]);
    pathIndices.push(idx % 2);

    const nextLayer: bigint[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      nextLayer.push(poseidon2([currentLayer[i], currentLayer[i + 1]]));
    }
    currentLayer = nextLayer;
    idx = Math.floor(idx / 2);
  }

  return { pathElements, pathIndices, root: currentLayer[0] };
}

// =============================================================================
// Main Test
// =============================================================================
async function main() {
  // @ts-ignore — dynamic import for snarkjs
  const snarkjs = await import("snarkjs");

  console.log("=== PunkZK Vault End-to-End Withdraw Test ===\n");

  // Connect to localnet or devnet
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8899";
  const connection = new Connection(rpcUrl, "confirmed");
  console.log(`Connected to: ${rpcUrl}`);

  // Load payer keypair
  const keypairPath = `${homedir()}/.config/solana/id.json`;
  const secretKey = new Uint8Array(JSON.parse(readFileSync(keypairPath, "utf-8")));
  const payer = Keypair.fromSecretKey(secretKey);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);

  let balance = await connection.getBalance(payer.publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < 1 * LAMPORTS_PER_SOL) {
    console.log("Requesting airdrop...");
    const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig);
    balance = await connection.getBalance(payer.publicKey);
    console.log(`New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  }

  // =========================================================================
  // Step 1: Initialize a fresh pool
  // =========================================================================
  console.log("\n--- Step 1: Initialize fresh pool ---");
  const tornadoInstance = Keypair.generate();
  const denomination = 100_000_000; // 0.1 SOL
  const treeHeight = 5;

  const [merkleTreePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("merkle_tree"), tornadoInstance.publicKey.toBuffer()],
    PROGRAM_ID
  );

  const initData = Buffer.concat([IX_INITIALIZE, serializeU64(denomination), serializeU8(treeHeight)]);
  const initIx = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstance.publicKey, isSigner: true, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"), isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: initData,
  });

  const initTx = new Transaction().add(initIx);
  const initSig = await sendAndConfirmTransaction(connection, initTx, [payer, tornadoInstance]);
  console.log(`✅ Pool initialized: ${tornadoInstance.publicKey.toBase58()}`);
  console.log(`   Merkle tree PDA: ${merkleTreePDA.toBase58()}`);
  console.log(`   Tx: ${initSig}`);

  // =========================================================================
  // Step 2: Generate commitment and deposit
  // =========================================================================
  console.log("\n--- Step 2: Deposit 0.1 SOL ---");

  // Generate nullifier and secret (31 bytes, padded to 32)
  const nullifier = Buffer.alloc(32);
  randomBytes(31).copy(nullifier);
  const secret = Buffer.alloc(32);
  randomBytes(31).copy(secret);

  const nullifierBigInt = bufferToBigIntLE(nullifier);
  const secretBigInt = bufferToBigIntLE(secret);

  // Compute commitment = Poseidon(nullifier, secret) — matching on-chain
  const commitmentBigInt = poseidon2([nullifierBigInt, secretBigInt]);
  const commitment = bigIntToBufferLE(commitmentBigInt);

  // Compute nullifier hash = Poseidon(nullifier) — matching on-chain
  const nullifierHashBigInt = poseidon1([nullifierBigInt]);
  const nullifierHash = bigIntToBufferLE(nullifierHashBigInt);

  console.log(`  Nullifier (first 8 bytes): ${nullifier.subarray(0, 8).toString("hex")}`);
  console.log(`  Commitment: ${commitment.toString("hex").substring(0, 16)}...`);
  console.log(`  NullifierHash: ${nullifierHash.toString("hex").substring(0, 16)}...`);

  const depositData = Buffer.concat([IX_DEPOSIT, serializeBytes32(commitment)]);
  const depositIx = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstance.publicKey, isSigner: false, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: depositData,
  });

  const depositTx = new Transaction().add(depositIx);
  const depositSig = await sendAndConfirmTransaction(connection, depositTx, [payer]);
  console.log(`✅ Deposit succeeded! Tx: ${depositSig}`);

  // =========================================================================
  // Step 3: Build Merkle proof and generate ZK proof
  // =========================================================================
  console.log("\n--- Step 3: Generate ZK Proof ---");

  const recipientPubkey = new PublicKey("5asoq4MUXCgVfMHM4bcJJdqZQkUGeTwYamePhL69w6fH");
  const recipientBigInt = BigInt("0x" + recipientPubkey.toBuffer().toString("hex")) % FR_MODULUS;
  const relayerBigInt = BigInt(0);
  const fee = 0;
  const refund = 0;

  // Build Merkle proof — single leaf at index 0
  const { pathElements, pathIndices, root } = buildMerkleProof(
    commitmentBigInt, 0, [commitmentBigInt], treeHeight
  );
  const rootBuffer = bigIntToBufferLE(root);

  console.log(`  Root (LE hex): ${rootBuffer.toString("hex").substring(0, 16)}...`);
  console.log(`  Root (BigInt): ${root.toString().substring(0, 30)}...`);

  // Generate ZK proof
  const proofInput = {
    root: root.toString(),
    nullifierHash: nullifierHashBigInt.toString(),
    recipient: recipientBigInt.toString(),
    relayer: relayerBigInt.toString(),
    fee: fee.toString(),
    refund: refund.toString(),
    nullifier: nullifierBigInt.toString(),
    secret: secretBigInt.toString(),
    pathElements: pathElements.map(e => e.toString()),
    pathIndices: pathIndices.map(i => i.toString()),
  };

  console.log("  Generating Groth16 proof with snarkjs...");
  console.time("  Proof generation time");
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    proofInput, WASM_PATH, ZKEY_PATH
  );
  console.timeEnd("  Proof generation time");
  console.log(`  ✅ Proof generated!`);
  console.log(`  Public signals: [${publicSignals.map((s: string) => s.substring(0, 15) + "...").join(", ")}]`);

  // Verify off-chain first
  const vkey = JSON.parse(readFileSync(path.join(CIRCUITS_DIR, "verification_key.json"), "utf-8"));
  const offChainValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);
  console.log(`  Off-chain verification: ${offChainValid ? "✅ VALID" : "❌ INVALID"}`);

  if (!offChainValid) {
    throw new Error("Off-chain proof verification failed! Something is wrong with the proof generation.");
  }

  // =========================================================================
  // Step 4: Serialize proof and submit withdraw
  // =========================================================================
  console.log("\n--- Step 4: Submit Withdraw Transaction ---");

  // Serialize proof for on-chain verifier (256 bytes total)
  const serializedProof = Buffer.concat([
    packG1Negated(proof.pi_a),  // -A (negated Y for pairing equation)
    packG2(proof.pi_b),          // B
    packG1(proof.pi_c)           // C
  ]);

  console.log(`  Proof size: ${serializedProof.length} bytes`);
  console.log(`  Root LE (to send): ${rootBuffer.toString("hex").substring(0, 16)}...`);
  console.log(`  NullifierHash LE (to send): ${nullifierHash.toString("hex").substring(0, 16)}...`);

  const withdrawData = Buffer.concat([
    IX_WITHDRAW,
    serializeVecU8(serializedProof),
    serializeBytes32(rootBuffer),       // root as LE (on-chain will reverse to BE)
    serializeBytes32(nullifierHash),     // nullifier_hash as LE
    serializeU64(fee),
    serializeU64(refund),
  ]);

  // Use recipient as both recipient and relayer (relayer=0 in circuit when fee=0)
  const withdrawIx = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstance.publicKey, isSigner: false, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: recipientPubkey, isSigner: false, isWritable: true },
      { pubkey: recipientPubkey, isSigner: false, isWritable: true }, // relayer = recipient when fee=0
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: withdrawData,
  });

  try {
    const withdrawTx = new Transaction().add(withdrawIx);
    const withdrawSig = await sendAndConfirmTransaction(connection, withdrawTx, [payer]);
    console.log(`\n🎉🎉🎉 WITHDRAWAL SUCCEEDED! 🎉🎉🎉`);
    console.log(`  Tx: ${withdrawSig}`);
  } catch (err: any) {
    console.error(`\n❌ Withdrawal failed!`);
    if (err.logs) {
      console.error("  Program logs:");
      for (const log of err.logs) {
        console.error(`    ${log}`);
      }
    } else {
      console.error(`  Error: ${err.message}`);
    }
    process.exit(1);
  }

  // =========================================================================
  // Step 5: Verify on-chain state
  // =========================================================================
  console.log("\n--- Step 5: Verify State ---");

  const recipientBalance = await connection.getBalance(recipientPubkey);
  console.log(`  Recipient balance: ${recipientBalance / LAMPORTS_PER_SOL} SOL`);

  console.log("\n✅ End-to-end test complete!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
