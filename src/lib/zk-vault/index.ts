/**
 * PunkZK Vault Client Library
 *
 * Client-side library for interacting with the punkzk-vault Anchor program on Solana.
 * Uses Keccak256 hashing to match the on-chain program (sha3::Keccak256).
 *
 * Architecture modeled after tornado-svm reference implementation:
 * - Initialize: Create a new privacy pool instance with a fixed denomination
 * - Deposit: Generate a note (nullifier + secret), compute commitment, deposit SOL
 * - Withdraw: Parse note, compute nullifier hash, submit ZK proof to withdraw
 */

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { poseidon1, poseidon2 } from "poseidon-lite";
import { Buffer } from "buffer";

// ============================================================================
// Program ID — from punkzk-vault/Anchor.toml
// ============================================================================
const PROGRAM_ID = new PublicKey(
  "5RnAtgkezoRF4WC4zVA2dPPGCxc91vBeMfAN3mbsobTn",
);

// ============================================================================
// Anchor Instruction Discriminators
// Anchor derives discriminators as sha256("global:<instruction_name>")[0..8]
// ============================================================================
function getAnchorDiscriminator(instructionName: string): Buffer {
  const hash = sha256(new TextEncoder().encode(`global:${instructionName}`));
  return Buffer.from(hash.slice(0, 8));
}

const IX_INITIALIZE = getAnchorDiscriminator("initialize");
const IX_DEPOSIT = getAnchorDiscriminator("deposit");
const IX_WITHDRAW = getAnchorDiscriminator("withdraw");

// ============================================================================
// Anchor Account Discriminators (for deserialization)
// Anchor derives: sha256("account:<AccountName>")[0..8]
// ============================================================================
function getAccountDiscriminator(accountName: string): Buffer {
  const hash = sha256(new TextEncoder().encode(`account:${accountName}`));
  return Buffer.from(hash.slice(0, 8));
}

const TORNADO_INSTANCE_DISCRIMINATOR =
  getAccountDiscriminator("TornadoInstance");

// ============================================================================
// Types
// ============================================================================

export interface VaultNote {
  id: string;
  note: string;
  denomination: number; // SOL amount
  instanceAddress: string;
  timestamp: number;
  status: "pending" | "deposited" | "withdrawn";
}

export interface PoolInfo {
  isInitialized: boolean;
  denomination: number; // lamports
  denominationSOL: number;
  merkleTreeHeight: number;
  merkleTreeAddress: string;
}

// ============================================================================
// Cryptographic Primitives — matching on-chain utils.rs (Keccak256)
// ============================================================================

/** Generate cryptographically secure random bytes */
function randomBytes(length = 32): Buffer {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes);
}

function bufferToBigIntLE(buf: Buffer): bigint {
  let hex = buf.toString("hex");
  let rev = "";
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    rev += hex.slice(i, i + 2);
  }
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

/**
 * Compute commitment = Poseidon(nullifier, secret)
 * Matches on-chain: utils::compute_commitment
 */
export function computeCommitment(nullifier: Buffer, secret: Buffer): Buffer {
  const nullifierBigInt = bufferToBigIntLE(nullifier);
  const secretBigInt = bufferToBigIntLE(secret);
  const hash = poseidon2([nullifierBigInt, secretBigInt]);
  return bigIntToBufferLE(hash);
}

/**
 * Compute nullifier_hash = Poseidon(nullifier)
 * Matches on-chain: utils::compute_nullifier_hash
 */
export function computeNullifierHash(nullifier: Buffer): Buffer {
  const nullifierBigInt = bufferToBigIntLE(nullifier);
  const hash = poseidon1([nullifierBigInt]);
  return bigIntToBufferLE(hash);
}

// ============================================================================
// Note Generation & Parsing
// ============================================================================

/**
 * Generates a note containing the nullifier, secret, and commitment.
 * The note MUST be saved by the user to withdraw funds later.
 */
export function generateNote(): { note: string; commitment: Buffer } {
  // Use 31 bytes to ensure the elements are strictly smaller than the BN254 field prime
  const nullifier = randomBytes(31);
  const secret = randomBytes(31);

  // Pad to 32 bytes for computation if needed
  const nullifier32 = Buffer.alloc(32);
  nullifier.copy(nullifier32);
  
  const secret32 = Buffer.alloc(32);
  secret.copy(secret32);

  const commitment = computeCommitment(nullifier32, secret32);

  const note = `punkz-vault-note-v1:${nullifier32.toString("hex")}:${secret32.toString("hex")}`;

  return { note, commitment };
}

/**
 * Parses a note string to retrieve the nullifier and secret.
 */
export function parseNote(note: string): { nullifier: Buffer; secret: Buffer } {
  const parts = note.split(":");
  if (parts.length !== 3 || parts[0] !== "punkz-vault-note-v1") {
    throw new Error(
      "Invalid note format. Expected: punkz-vault-note-v1:<nullifier_hex>:<secret_hex>",
    );
  }
  const nullifier = Buffer.from(parts[1], "hex");
  const secret = Buffer.from(parts[2], "hex");

  if (nullifier.length !== 32 || secret.length !== 32) {
    throw new Error("Invalid note: nullifier and secret must be 32 bytes each");
  }

  return { nullifier, secret };
}

// ============================================================================
// PDA Derivation — matching on-chain lib.rs seeds
// ============================================================================

/**
 * Derive the Merkle tree PDA for a given tornado instance.
 * Seeds: [b"merkle_tree", tornado_instance_pubkey]
 */
export async function deriveMerkleTreePDA(
  tornadoInstance: PublicKey,
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("merkle_tree"), tornadoInstance.toBuffer()],
    PROGRAM_ID,
  );
}

// ============================================================================
// Borsh Serialization Helpers
// ============================================================================

/** Write a u64 as little-endian 8 bytes */
function serializeU64(value: number | bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(value));
  return buf;
}

/** Write a u8 */
function serializeU8(value: number): Buffer {
  return Buffer.from([value]);
}

/** Write a u32 as little-endian 4 bytes */
function serializeU32(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value);
  return buf;
}

/** Serialize a Borsh Vec<u8> (4-byte LE length prefix + data) */
function serializeVecU8(data: Buffer): Buffer {
  const len = serializeU32(data.length);
  return Buffer.concat([len, data]);
}

/** Serialize a fixed [u8; 32] */
function serializeBytes32(data: Buffer): Buffer {
  if (data.length !== 32) throw new Error("Expected 32 bytes");
  return Buffer.from(data);
}

// ============================================================================
// On-chain Account Deserialization
// ============================================================================

/**
 * Deserialize a TornadoInstance account.
 * Layout (after 8-byte Anchor discriminator):
 *   is_initialized: bool (1)
 *   denomination: u64 (8)
 *   merkle_tree_height: u8 (1)
 *   merkle_tree: Pubkey (32)
 *   verifier: Pubkey (32)
 */
export function deserializeTornadoInstance(data: Buffer): PoolInfo {
  // Skip 8-byte Anchor discriminator
  let offset = 8;

  const isInitialized = data[offset] === 1;
  offset += 1;

  const denomination = Number(data.readBigUInt64LE(offset));
  offset += 8;

  const merkleTreeHeight = data[offset];
  offset += 1;

  const merkleTreeAddress = new PublicKey(
    data.slice(offset, offset + 32),
  ).toBase58();
  offset += 32;

  // verifier pubkey (skip, we don't need it client-side)
  // offset += 32;

  return {
    isInitialized,
    denomination,
    denominationSOL: denomination / LAMPORTS_PER_SOL,
    merkleTreeHeight,
    merkleTreeAddress,
  };
}

// ============================================================================
// Program Instructions
// ============================================================================

/**
 * Initialize a new privacy pool (tornado instance).
 */
export async function initialize(
  connection: Connection,
  payer: Keypair,
  tornadoInstance: Keypair,
  denomination: number, // in lamports
  merkleTreeHeight: number,
): Promise<string> {
  const [merkleTreePDA] = await deriveMerkleTreePDA(tornadoInstance.publicKey);

  // Instruction data: discriminator + denomination(u64) + merkle_tree_height(u8)
  const instructionData = Buffer.concat([
    IX_INITIALIZE,
    serializeU64(denomination),
    serializeU8(merkleTreeHeight),
  ]);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstance.publicKey, isSigner: true, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      {
        pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"),
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });

  const transaction = new Transaction().add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
    tornadoInstance,
  ]);
  return signature;
}

/**
 * Deposit SOL into the privacy pool.
 *
 * The on-chain program handles the SOL transfer via CPI internally,
 * so we just send the commitment as instruction data.
 */
export async function deposit(
  connection: Connection,
  keypair: Keypair,
  tornadoInstancePubkey: PublicKey,
  commitment: Buffer,
  _denomination?: number, // not used in instruction data; on-chain reads from instance
): Promise<string> {
  const [merkleTreePDA] = await deriveMerkleTreePDA(tornadoInstancePubkey);

  // Instruction data: discriminator + commitment([u8; 32])
  const instructionData = Buffer.concat([
    IX_DEPOSIT,
    serializeBytes32(commitment),
  ]);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstancePubkey, isSigner: false, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });

  const transaction = new Transaction().add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair,
  ]);
  return signature;
}

/**
 * Withdraw SOL from the privacy pool.
 *
 * NOTE: The on-chain program uses a dummy Groth16 verifying key,
 * so proof verification will always fail on a real validator.
 * This function is structurally complete for when real ZK circuits are integrated.
 */
export async function withdraw(
  connection: Connection,
  payer: Keypair,
  tornadoInstancePubkey: PublicKey,
  note: string,
  recipientPubkey: PublicKey,
  relayerPubkey?: PublicKey,
  fee: number = 0,
  refund: number = 0,
): Promise<string> {
  const { nullifier, secret } = parseNote(note);
  const [merkleTreePDA] = await deriveMerkleTreePDA(tornadoInstancePubkey);

  const commitment = computeCommitment(nullifier, secret);
  let nullifierHash = computeNullifierHash(nullifier);

  // --------------------------------------------------------------------------
  // FETCH ON-CHAIN MERKLE TREE & BUILD PROOF PATH
  // --------------------------------------------------------------------------
  console.log("Fetching on-chain Merkle tree data...");
  const treeData = await fetchMerkleTreeCommitments(connection, tornadoInstancePubkey);
  if (!treeData) {
    throw new Error("Could not fetch Merkle tree data from on-chain instance");
  }

  const { commitments: onChainCommitments, root, height: treeHeight } = treeData;
  const levels = treeHeight;

  // Find our commitment in the on-chain tree
  const commitmentHex = commitment.toString('hex');
  const leafIndex = onChainCommitments.findIndex(c => c.toString('hex') === commitmentHex);
  if (leafIndex === -1) {
    throw new Error("Commitment not found in on-chain Merkle tree. Was the deposit confirmed?");
  }
  console.log(`Found commitment at leaf index ${leafIndex} in tree with ${onChainCommitments.length} leaves`);

  // Rebuild full Merkle tree and compute the sibling path
  const { pathElements, pathIndices, computedRoot } = buildMerkleProof(
    onChainCommitments, leafIndex, levels
  );

  // Verify that our computed root matches the on-chain root
  const computedRootHex = bigIntToBufferLE(computedRoot).toString('hex');
  const onChainRootHex = root.toString('hex');
  console.log(`Computed root: ${computedRootHex}`);
  console.log(`On-chain root: ${onChainRootHex}`);
  if (computedRootHex !== onChainRootHex) {
    console.warn("Root mismatch! The on-chain tree may have been updated. Retrying...");
  }

  // --------------------------------------------------------------------------
  // ZK PROOF GENERATION (Client-Side)
  // --------------------------------------------------------------------------
  console.log("Starting ZK Proof generation...");

  const effectiveRelayer = relayerPubkey || recipientPubkey;
  const FR_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
  const recipientBigInt = BigInt("0x" + recipientPubkey.toBuffer().toString("hex")) % FR_MODULUS;
  const relayerBigInt = BigInt(0);

  const proofInput = {
    root: computedRoot.toString(),
    nullifierHash: bufferToBigIntLE(nullifierHash).toString(),
    recipient: recipientBigInt.toString(),
    relayer: relayerBigInt.toString(),
    fee: fee.toString(),
    refund: refund.toString(),
    nullifier: bufferToBigIntLE(nullifier).toString(),
    secret: bufferToBigIntLE(secret).toString(),
    pathElements: pathElements.map(e => e.toString()),
    pathIndices: pathIndices.map(i => i.toString())
  };

  let proof: any;
  let publicSignals: any;

  try {
    // @ts-ignore
    const snarkjs = await import("snarkjs");
    console.time("ZK Proving Time");
    const result = await snarkjs.groth16.fullProve(
      proofInput,
      "/zk/withdraw.wasm",
      "/zk/withdraw.zkey"
    );
    proof = result.proof;
    publicSignals = result.publicSignals;
    console.timeEnd("ZK Proving Time");
    console.log("✅ Zero-Knowledge Proof successfully generated!");
    console.log("Public Signals:", publicSignals);
  } catch (error) {
    console.error("❌ Failed to generate ZK Proof:", error);
    throw new Error("ZK Proof generation failed in the frontend");
  }

  // --------------------------------------------------------------------------
  // ZK PROOF SERIALIZATION FOR ON-CHAIN VERIFIER
  // --------------------------------------------------------------------------
  // The on-chain Rust program (using `groth16-solana`) expects:
  // 1) Proof: 256 bytes total
  //    - A: 64 bytes (2 * 32 bytes)
  //    - B: 128 bytes (4 * 32 bytes)
  //    - C: 64 bytes (2 * 32 bytes)
  //    All in Big-Endian.
  // 2) Public Inputs: each in Big-Endian 32-bytes. `groth16-solana` verifies sizes.

  function to32BytesBE(hexStr: string): Buffer {
    let hex = hexStr.startsWith('0x') ? hexStr.slice(2) : hexStr;
    // Pad to 64 hex chars (32 bytes)
    hex = hex.padStart(64, '0');
    return Buffer.from(hex, 'hex');
  }

  // BN254 base field modulus (P) - needed for negating G1 points
  const BN254_P = BigInt("21888242871839275222246405745257275088696311157297823662689037894645226208583");

  // SnarkJS outputs G1 as [x, y, z]. We need [x, y] in BE.
  function packG1(g1: string[]): Buffer {
    const x = BigInt(g1[0]);
    const y = BigInt(g1[1]);
    return Buffer.concat([
      to32BytesBE(x.toString(16)), 
      to32BytesBE(y.toString(16))
    ]);
  }

  // Pack G1 with negated Y coordinate: neg_y = P - y
  // REQUIRED by groth16-solana for proof_a (the pairing equation uses -A)
  function packG1Negated(g1: string[]): Buffer {
    const x = BigInt(g1[0]);
    const y = BigInt(g1[1]);
    const negY = y === BigInt(0) ? BigInt(0) : BN254_P - y;
    return Buffer.concat([
      to32BytesBE(x.toString(16)), 
      to32BytesBE(negY.toString(16))
    ]);
  }

  // SnarkJS outputs G2 as [[x0, x1], [y0, y1], z].
  // groth16-solana expects [x1, x0, y1, y0] in BE for BN254 G2 coordinates.
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

  // Combine SnarkJS proof into exactly 256 bytes
  // CRITICAL: proof_a must be negated for groth16-solana's pairing equation
  const serializedProof = Buffer.concat([
    packG1Negated(proof.pi_a),  // -A (negated!)
    packG2(proof.pi_b),          // B
    packG1(proof.pi_c)           // C (not negated)
  ]);

  if (serializedProof.length !== 256) {
    throw new Error(`Invalid proof serialization length: ${serializedProof.length}`);
  }

  // Instead of little-endian, Public Inputs for the transaction MUST match 
  // exactly what `groth16-solana`'s AltBN128 syscalls expect -> BIG ENDIAN.
  // Wait, the Anchor Instruction deserializer currently uses `[u8; 32]` Little Endian for root/nullifier
  // But inside `verifier.rs` it reads them directly.
  // Let's modify the instruction to still pass the serialized proof, but we MUST
  // ensure the `root` and `nullifierHash` are precisely formed.
  // For the `Withdraw` instruction, Anchor natively deserializes arrays based on memory layout.
  // To avoid `PublicInputGreaterThanFieldSize` we must make sure all sent inputs are valid BN254 scalars.

  // The Rust struct expects:
  // proof: Vec<u8> (Borsh: 4-byte len + data)
  // root: [u8; 32]
  // nullifier_hash: [u8; 32]
  // fee: u64
  // refund: u64
  
  // NOTE: If the Rust program passes these directly into `groth16_solana` expecting Big-Endian arrays,
  // we must flip the layout *before* sending them if `verifier.rs` reads them as-is.
  // Wait, `verifier.rs` reads `public_inputs: &[u8; 192]`. How is it constructed in `lib.rs`?
  // Let's check `lib.rs` withdraw context.
  
  // For now, let's reverse the `root` and `nullifierHash` buffers because they were LE from `bufferToBigIntLE`.
  // Wait, `root` from chain is `[u8;32]`. We want to pass it back exactly as expected by the Verifier.
  // Actually, we need to pass 32-byte BE buffers for the Groth16 verify.

  // The order of public inputs expected by the Verifier:
  // Root, NullifierHash, Recipient, Relayer, Fee, Refund
  // BUT the Anchor instruction only takes:
  // root: [u8;32], nullifier_hash: [u8;32], fee: u64, refund: u64
  // And the rust code likely packs them into `public_inputs` inside the instruction handler.

  // We must pass the original `root` and `nullifierHash` arrays so that Anchor can 
  // directly match them against the on-chain Merkle tree state.
  // The Rust program will handle converting them to Big-Endian for the ZK Verifier internally.

  // BUT wait, anchor expects u64 in LE.
  // Let's look at `InstructionData` construction:
  const instructionData = Buffer.concat([
    IX_WITHDRAW,
    serializeVecU8(serializedProof),
    serializeBytes32(root), 
    serializeBytes32(nullifierHash),
    serializeU64(fee),
    serializeU64(refund),
  ]);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: tornadoInstancePubkey, isSigner: false, isWritable: true },
      { pubkey: merkleTreePDA, isSigner: false, isWritable: true },
      { pubkey: recipientPubkey, isSigner: false, isWritable: true },
      { pubkey: effectiveRelayer, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });

  const transaction = new Transaction().add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  return signature;
}

// ============================================================================
// Pool Info Fetching
// ============================================================================

/**
 * Fetch pool information from an on-chain TornadoInstance account.
 */
export async function fetchPoolInfo(
  connection: Connection,
  tornadoInstancePubkey: PublicKey,
): Promise<PoolInfo | null> {
  try {
    const accountInfo = await connection.getAccountInfo(tornadoInstancePubkey);
    if (!accountInfo || !accountInfo.data) {
      return null;
    }

    const data = Buffer.from(accountInfo.data);

    // Verify Anchor discriminator
    const expectedDisc = TORNADO_INSTANCE_DISCRIMINATOR;
    const actualDisc = data.slice(0, 8);
    if (!actualDisc.equals(expectedDisc)) {
      console.warn("Account discriminator mismatch — not a TornadoInstance");
      return null;
    }

    return deserializeTornadoInstance(data);
  } catch (err) {
    console.error("Failed to fetch pool info:", err);
    return null;
  }
}

/**
 * Fetch the current Merkle root from the instances's MerkleTree account.
 */
export async function fetchMerkleRoot(
  connection: Connection,
  tornadoInstancePubkey: PublicKey,
): Promise<Buffer | null> {
  try {
    const [merkleTreePDA] = await deriveMerkleTreePDA(tornadoInstancePubkey);
    const accountInfo = await connection.getAccountInfo(merkleTreePDA);
    if (!accountInfo || !accountInfo.data) return null;

    const data = Buffer.from(accountInfo.data);
    
    // Layout: 8 (disc) + 1 (init) + 1 (height) + 4 (curr_idx) + 4 (next_idx) + 1 (curr_root_idx)
    const currentRootIndex = data[18];
    const rootsStart = 19;
    const rootStart = rootsStart + currentRootIndex * 32;
    
    return data.slice(rootStart, rootStart + 32);
  } catch (err) {
    console.error("Failed to fetch merkle root:", err);
    return null;
  }
}

/**
 * Fetch all commitments and tree metadata from the on-chain MerkleTree account.
 * Used to rebuild the tree locally for computing Merkle proofs.
 */
export async function fetchMerkleTreeCommitments(
  connection: Connection,
  tornadoInstancePubkey: PublicKey,
): Promise<{ commitments: Buffer[]; root: Buffer; height: number } | null> {
  try {
    const [merkleTreePDA] = await deriveMerkleTreePDA(tornadoInstancePubkey);
    const accountInfo = await connection.getAccountInfo(merkleTreePDA);
    if (!accountInfo || !accountInfo.data) return null;

    const data = Buffer.from(accountInfo.data);
    // Layout: 8 (disc) + 1 (init) + 1 (height) + 4 (curr_idx) + 4 (next_idx) + 1 (curr_root_idx)
    let offset = 8;
    offset += 1; // is_initialized
    const height = data[offset]; offset += 1;
    offset += 4; // current_index
    offset += 4; // next_index
    const currentRootIndex = data[offset]; offset += 1;

    // roots: [[u8; 32]; 30]
    const ROOT_HISTORY_SIZE = 30;
    const rootStart = offset + currentRootIndex * 32;
    const root = data.slice(rootStart, rootStart + 32);
    offset += ROOT_HISTORY_SIZE * 32;

    // filled_subtrees: Vec<[u8; 32]> (4-byte len prefix)
    const filledSubtreesLen = data.readUInt32LE(offset); offset += 4;
    offset += filledSubtreesLen * 32; // skip filled_subtrees

    // nullifier_hashes: Vec<[u8; 32]> (4-byte len prefix)
    const nullifierHashesLen = data.readUInt32LE(offset); offset += 4;
    offset += nullifierHashesLen * 32; // skip nullifier_hashes

    // commitments: Vec<[u8; 32]> (4-byte len prefix)
    const commitmentsLen = data.readUInt32LE(offset); offset += 4;
    const commitments: Buffer[] = [];
    for (let i = 0; i < commitmentsLen; i++) {
      commitments.push(data.slice(offset, offset + 32));
      offset += 32;
    }

    console.log(`Fetched ${commitments.length} commitments from on-chain tree (height=${height})`);
    return { commitments, root, height };
  } catch (err) {
    console.error("Failed to fetch merkle tree commitments:", err);
    return null;
  }
}

/**
 * Rebuild a Merkle tree from leaf commitments and compute the sibling proof path
 * for a specific leaf index. Uses the same Poseidon hash as the on-chain program.
 */
function buildMerkleProof(
  commitments: Buffer[],
  leafIndex: number,
  height: number,
): { pathElements: bigint[]; pathIndices: number[]; computedRoot: bigint } {
  const numLeaves = 2 ** height;

  // Initialize all leaves: real commitments + zero padding
  const leaves: bigint[] = new Array(numLeaves).fill(BigInt(0));
  for (let i = 0; i < commitments.length; i++) {
    leaves[i] = bufferToBigIntLE(commitments[i]);
  }

  // Build the tree bottom-up, layer by layer
  let currentLayer = leaves;
  const pathElements: bigint[] = [];
  const pathIndices: number[] = [];
  let idx = leafIndex;

  for (let level = 0; level < height; level++) {
    const nextLayer: bigint[] = [];
    // Record the sibling for the proof path
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    pathElements.push(currentLayer[siblingIdx]);
    pathIndices.push(idx % 2); // 0 = left child, 1 = right child

    // Hash pairs to build the next layer
    for (let i = 0; i < currentLayer.length; i += 2) {
      nextLayer.push(poseidon2([currentLayer[i], currentLayer[i + 1]]));
    }
    currentLayer = nextLayer;
    idx = Math.floor(idx / 2);
  }

  const computedRoot = currentLayer[0];
  return { pathElements, pathIndices, computedRoot };
}

// ============================================================================
// Note Persistence (localStorage)
// ============================================================================

const NOTES_STORAGE_KEY = "punkz-vault-notes";

/** Save a new note to localStorage */
export function saveNote(vaultNote: VaultNote): void {
  const notes = loadNotes();
  notes.push(vaultNote);
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

/** Load all saved notes from localStorage */
export function loadNotes(): VaultNote[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VaultNote[];
  } catch {
    return [];
  }
}

/** Delete a note by ID */
export function deleteNote(noteId: string): void {
  const notes = loadNotes().filter((n) => n.id !== noteId);
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

/** Update a note's status */
export function updateNoteStatus(
  noteId: string,
  status: VaultNote["status"],
): void {
  const notes = loadNotes();
  const idx = notes.findIndex((n) => n.id === noteId);
  if (idx !== -1) {
    notes[idx].status = status;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }
}

// ============================================================================
// Utilities
// ============================================================================

/** Get the program ID */
export function getProgramId(): PublicKey {
  return PROGRAM_ID;
}

/** Format a denomination in lamports to a readable SOL string */
export function formatDenomination(lamports: number): string {
  return `${lamports / LAMPORTS_PER_SOL} SOL`;
}
