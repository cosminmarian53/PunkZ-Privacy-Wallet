import { Connection, Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import { initialize } from "../src/lib/zk-vault/index.js";

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  const keypairPath = `${homedir()}/.config/solana/id.json`;
  const secretKey = new Uint8Array(JSON.parse(readFileSync(keypairPath, "utf-8")));
  const payer = Keypair.fromSecretKey(secretKey);

  const balance = await connection.getBalance(payer.publicKey);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Balance: ${balance / 1e9} SOL`);

  // Generate 0.1 SOL pool
  const denom01 = 100_000_000; // 0.1 SOL
  const pool01 = Keypair.generate();
  console.log(`\n======================================================`);
  console.log(`✨ NEW PRIVACY POOL INSTANCE (0.1 SOL) ✨`);
  console.log(`Instance Address: ${pool01.publicKey.toBase58()}`);
  console.log(`Initializing...`);
  await initialize(connection, payer, pool01, denom01, 5);
  console.log(`✅ 0.1 SOL pool created!`);
  
  // Generate 1 SOL pool
  const denom1 = 1_000_000_000; // 1 SOL
  const pool1 = Keypair.generate();
  console.log(`\n======================================================`);
  console.log(`✨ NEW PRIVACY POOL INSTANCE (1 SOL) ✨`);
  console.log(`Instance Address: ${pool1.publicKey.toBase58()}`);
  console.log(`Initializing...`);
  await initialize(connection, payer, pool1, denom1, 5);
  console.log(`✅ 1 SOL pool created!`);
  
  // Generate 10 SOL pool
  const denom10 = 10_000_000_000; // 10 SOL
  const pool10 = Keypair.generate();
  console.log(`\n======================================================`);
  console.log(`✨ NEW PRIVACY POOL INSTANCE (10 SOL) ✨`);
  console.log(`Instance Address: ${pool10.publicKey.toBase58()}`);
  console.log(`Initializing...`);
  await initialize(connection, payer, pool10, denom10, 5);
  console.log(`✅ 10 SOL pool created!`);
  
  console.log(`\n======================================================`);
  console.log(`📋 UPDATE DEVNET_INSTANCES in PrivacyPoolScreen.tsx:`);
  console.log(`  0.1: '${pool01.publicKey.toBase58()}',`);
  console.log(`  1:   '${pool1.publicKey.toBase58()}',`);
  console.log(`  10:  '${pool10.publicKey.toBase58()}',`);
  console.log(`======================================================\n`);
}

main().catch(console.error);
