import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import {
  initialize,
  deposit,
  withdraw,
  generateNote,
  fetchPoolInfo,
  formatDenomination
} from "../src/lib/zk-vault/index.js";

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load local deployer keypair (which has ~10 SOL)
  const keypairPath = `${homedir()}/.config/solana/id.json`;
  const secretKey = new Uint8Array(JSON.parse(readFileSync(keypairPath, "utf-8")));
  const payer = Keypair.fromSecretKey(secretKey);
  
  console.log(`Using wallet: ${payer.publicKey.toBase58()}`);
  
  const balance = await connection.getBalance(payer.publicKey);
  console.log(`Balance: ${balance / 1e9} SOL`);

  // 1. Initialize a new Tornado Instance (0.1 SOL, height 5)
  console.log("\\n--- 1. INITIALIZE ---");
  const instanceKeypair = Keypair.generate();
  const denomination = 100_000_000; // 0.1 SOL
  const height = 5;
  
  console.log(`Initializing new pool instance at ${instanceKeypair.publicKey.toBase58()}...`);
  const initSig = await initialize(connection, payer, instanceKeypair, denomination, height);
  console.log(`Init success. Signature: ${initSig}`);
  
  // Verify state
  const poolInfo = await fetchPoolInfo(connection, instanceKeypair.publicKey);
  console.log(`Pool initialized with denomination: ${formatDenomination(poolInfo!.denomination)}`);

  // 2. Deposit
  console.log("\\n--- 2. DEPOSIT ---");
  console.log("Generating note...");
  const { note, commitment } = generateNote();
  console.log(`Note: ${note}`);
  console.log(`Commitment: ${commitment.toString("hex")}`);
  
  console.log("Submitting deposit transaction...");
  const depositSig = await deposit(connection, payer, instanceKeypair.publicKey, commitment);
  console.log(`Deposit success. Signature: ${depositSig}`);
  
  // 3. Withdraw
  console.log("\\n--- 3. WITHDRAW ---");
  // We withdraw to the same payer address for simplicity in this test
  console.log("Submitting withdrawal transaction...");
  const withdrawSig = await withdraw(
    connection, 
    payer, 
    instanceKeypair.publicKey, 
    note, 
    payer.publicKey // recipient
  );
  console.log(`Withdraw success. Signature: ${withdrawSig}`);

  console.log("\\n✅ E2E Test Completed Successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
