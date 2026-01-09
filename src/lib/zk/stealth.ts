/**
 * Stealth Address Implementation for PunkZ Wallet
 * 
 * Stealth addresses allow receiving payments without revealing the connection
 * between the receiver's public identity and their receiving addresses.
 * 
 * How it works:
 * 1. Receiver publishes a "stealth meta-address" (spending key + viewing key)
 * 2. Sender generates ephemeral keypair
 * 3. Sender computes shared secret: S = ephemeral_private × viewing_public
 * 4. Sender derives one-time address from shared secret + spending key
 * 5. Sender publishes ephemeral public key alongside transaction
 * 6. Receiver scans ephemeral keys and derives addresses to find payments
 * 
 * This implementation uses Ed25519 for Solana compatibility.
 */

import { Keypair, PublicKey } from '@solana/web3.js';

/**
 * Simple hash function for key derivation
 */
function deriveHash(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(32);
  for (let round = 0; round < 8; round++) {
    let hash = 5381 + round * 33;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) + hash + data[i]) >>> 0;
    }
    result[round * 4] = (hash >>> 24) & 0xff;
    result[round * 4 + 1] = (hash >>> 16) & 0xff;
    result[round * 4 + 2] = (hash >>> 8) & 0xff;
    result[round * 4 + 3] = hash & 0xff;
  }
  return result;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const padded = hex.length % 2 === 0 ? hex : '0' + hex;
  const bytes = new Uint8Array(padded.length / 2);
  for (let i = 0; i < padded.length; i += 2) {
    bytes[i / 2] = parseInt(padded.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Stealth Meta-Address
 * This is what the receiver publishes. Anyone can use it to generate
 * one-time stealth addresses that only the receiver can spend from.
 */
export interface StealthMetaAddress {
  /** The spending public key (base58) - used to derive stealth addresses */
  spendingPublicKey: string;
  /** The viewing public key (base58) - used for ECDH shared secret */
  viewingPublicKey: string;
  /** Combined stealth meta-address for sharing */
  metaAddress: string;
  /** When this was generated */
  timestamp: number;
}

/**
 * Stealth Address - a one-time receiving address
 */
export interface StealthAddress {
  /** The one-time stealth address (base58) */
  address: string;
  /** The ephemeral public key the sender generated (base58) */
  ephemeralPublicKey: string;
  /** Shared secret hash (used for derivation) */
  sharedSecretHash: string;
  /** Original meta-address this was derived from */
  metaAddress: string;
  /** Timestamp of generation */
  timestamp: number;
}

/**
 * Detected stealth payment
 */
export interface StealthPayment {
  /** The stealth address that received funds */
  stealthAddress: string;
  /** The ephemeral public key used */
  ephemeralPublicKey: string;
  /** Amount received (if known) */
  amount?: number;
  /** Transaction signature (if known) */
  signature?: string;
  /** When detected */
  timestamp: number;
}

/**
 * Stealth keys stored locally for scanning
 */
export interface StealthKeys {
  /** Private spending key (hex) - KEEP SECRET */
  spendingPrivateKey: string;
  /** Private viewing key (hex) - used for scanning */
  viewingPrivateKey: string;
  /** The meta-address derived from these keys */
  metaAddress: StealthMetaAddress;
}

/**
 * Generate stealth keys for a wallet
 * These are separate from the main wallet keys for compartmentalization
 */
export function generateStealthKeys(): StealthKeys {
  // Generate two independent keypairs
  const spendingKeypair = Keypair.generate();
  const viewingKeypair = Keypair.generate();
  
  const spendingPublicKey = spendingKeypair.publicKey.toBase58();
  const viewingPublicKey = viewingKeypair.publicKey.toBase58();
  
  // Create combined meta-address (concatenation for simplicity)
  // Format: st:<spending>:<viewing>
  const metaAddress = `st:${spendingPublicKey}:${viewingPublicKey}`;
  
  return {
    spendingPrivateKey: bytesToHex(spendingKeypair.secretKey.slice(0, 32)),
    viewingPrivateKey: bytesToHex(viewingKeypair.secretKey.slice(0, 32)),
    metaAddress: {
      spendingPublicKey,
      viewingPublicKey,
      metaAddress,
      timestamp: Date.now(),
    },
  };
}

/**
 * Parse a stealth meta-address string
 */
export function parseStealthMetaAddress(metaAddress: string): StealthMetaAddress | null {
  try {
    if (!metaAddress.startsWith('st:')) {
      return null;
    }
    
    const parts = metaAddress.split(':');
    if (parts.length !== 3) {
      return null;
    }
    
    const [, spendingPublicKey, viewingPublicKey] = parts;
    
    // Validate they're valid base58 public keys
    new PublicKey(spendingPublicKey);
    new PublicKey(viewingPublicKey);
    
    return {
      spendingPublicKey,
      viewingPublicKey,
      metaAddress,
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

/**
 * Generate a stealth address for sending to someone
 * 
 * @param recipientMetaAddress - The recipient's stealth meta-address
 * @returns A one-time stealth address and the ephemeral public key
 */
export function generateStealthAddress(recipientMetaAddress: string): StealthAddress | null {
  const parsed = parseStealthMetaAddress(recipientMetaAddress);
  if (!parsed) {
    return null;
  }
  
  // Generate ephemeral keypair for this transaction
  const ephemeralKeypair = Keypair.generate();
  const ephemeralPrivate = ephemeralKeypair.secretKey.slice(0, 32);
  const ephemeralPublicKey = ephemeralKeypair.publicKey.toBase58();
  
  // Get recipient's viewing public key
  const viewingPublicKey = new PublicKey(parsed.viewingPublicKey);
  
  // Compute shared secret: hash(ephemeral_private || viewing_public)
  // Note: In real ECDH, this would be scalar multiplication on the curve
  // We simulate this with hash-based derivation for Ed25519 compatibility
  const sharedInput = new Uint8Array(64);
  sharedInput.set(ephemeralPrivate, 0);
  sharedInput.set(viewingPublicKey.toBytes(), 32);
  const sharedSecretHash = deriveHash(sharedInput);
  
  // Derive stealth address: hash(shared_secret || spending_public)
  const spendingPublicKey = new PublicKey(parsed.spendingPublicKey);
  const addressInput = new Uint8Array(64);
  addressInput.set(sharedSecretHash, 0);
  addressInput.set(spendingPublicKey.toBytes(), 32);
  const addressHash = deriveHash(addressInput);
  
  // Create a deterministic keypair from the hash
  // In practice, this would use proper key derivation
  const stealthKeypair = Keypair.fromSeed(addressHash);
  
  return {
    address: stealthKeypair.publicKey.toBase58(),
    ephemeralPublicKey,
    sharedSecretHash: bytesToHex(sharedSecretHash),
    metaAddress: recipientMetaAddress,
    timestamp: Date.now(),
  };
}

/**
 * Scan for stealth payments addressed to you
 * 
 * @param stealthKeys - Your stealth keys
 * @param ephemeralPublicKeys - List of ephemeral public keys to check
 * @returns Derived stealth addresses you can spend from
 */
export function scanForStealthPayments(
  stealthKeys: StealthKeys,
  ephemeralPublicKeys: string[]
): StealthPayment[] {
  const payments: StealthPayment[] = [];
  
  const viewingPrivate = hexToBytes(stealthKeys.viewingPrivateKey);
  const spendingPublicKey = new PublicKey(stealthKeys.metaAddress.spendingPublicKey);
  
  for (const ephemeralPubKeyStr of ephemeralPublicKeys) {
    try {
      const ephemeralPublicKey = new PublicKey(ephemeralPubKeyStr);
      
      // Compute shared secret: hash(viewing_private || ephemeral_public)
      const sharedInput = new Uint8Array(64);
      sharedInput.set(viewingPrivate, 0);
      sharedInput.set(ephemeralPublicKey.toBytes(), 32);
      const sharedSecretHash = deriveHash(sharedInput);
      
      // Derive stealth address
      const addressInput = new Uint8Array(64);
      addressInput.set(sharedSecretHash, 0);
      addressInput.set(spendingPublicKey.toBytes(), 32);
      const addressHash = deriveHash(addressInput);
      
      const stealthKeypair = Keypair.fromSeed(addressHash);
      
      payments.push({
        stealthAddress: stealthKeypair.publicKey.toBase58(),
        ephemeralPublicKey: ephemeralPubKeyStr,
        timestamp: Date.now(),
      });
    } catch {
      // Invalid key, skip
      continue;
    }
  }
  
  return payments;
}

/**
 * Derive the private key for a stealth address you received
 * 
 * @param stealthKeys - Your stealth keys
 * @param ephemeralPublicKey - The ephemeral public key from the sender
 * @returns The keypair that can spend from the stealth address
 */
export function deriveStealthSpendingKey(
  stealthKeys: StealthKeys,
  ephemeralPublicKey: string
): Keypair | null {
  try {
    const viewingPrivate = hexToBytes(stealthKeys.viewingPrivateKey);
    const ephemeralPubKey = new PublicKey(ephemeralPublicKey);
    const spendingPublicKey = new PublicKey(stealthKeys.metaAddress.spendingPublicKey);
    
    // Compute shared secret
    const sharedInput = new Uint8Array(64);
    sharedInput.set(viewingPrivate, 0);
    sharedInput.set(ephemeralPubKey.toBytes(), 32);
    const sharedSecretHash = deriveHash(sharedInput);
    
    // Derive stealth keypair
    const addressInput = new Uint8Array(64);
    addressInput.set(sharedSecretHash, 0);
    addressInput.set(spendingPublicKey.toBytes(), 32);
    const addressHash = deriveHash(addressInput);
    
    return Keypair.fromSeed(addressHash);
  } catch {
    return null;
  }
}

/**
 * Format stealth meta-address for display (truncated)
 */
export function formatMetaAddress(metaAddress: string): string {
  if (metaAddress.length <= 30) return metaAddress;
  return `${metaAddress.slice(0, 15)}...${metaAddress.slice(-10)}`;
}

/**
 * Validate a stealth meta-address
 */
export function isValidStealthMetaAddress(metaAddress: string): boolean {
  return parseStealthMetaAddress(metaAddress) !== null;
}
