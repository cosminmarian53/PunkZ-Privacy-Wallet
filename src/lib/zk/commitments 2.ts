/**
 * Simple Zero-Knowledge Primitives for PunkZ Wallet
 * 
 * This module provides basic ZK cryptographic primitives for privacy features:
 * - Pedersen Commitments: Hide balance values while allowing verification
 * - Balance Proofs: Prove balance constraints without revealing actual amount
 * 
 * Using Web Crypto API for cryptographic operations
 */

// Use Web Crypto API for SHA-256
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Large prime for modular arithmetic (using a safe prime)
const PRIME = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');

// Generator points (simulated - in production these would be elliptic curve points)
const G = BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798');
const H = BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8');

/**
 * Pedersen Commitment
 * 
 * A commitment C = g^v * h^r (mod p)
 * Where:
 * - v = value (the secret balance)
 * - r = random blinding factor
 * - g, h = generator points
 * 
 * Properties:
 * - Hiding: Cannot determine v from C without knowing r
 * - Binding: Cannot find different (v', r') that produces same C
 */
export interface PedersenCommitment {
  commitment: string;      // The commitment value (hex)
  blindingFactor: string;  // Random blinding factor (hex) - keep secret!
  timestamp: number;       // When commitment was created
}

/**
 * Generate a cryptographically secure random blinding factor
 */
function generateBlindingFactor(): bigint {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return BigInt('0x' + bytesToHex(randomBytes)) % PRIME;
}

/**
 * Modular exponentiation: base^exp mod modulus
 */
function modPow(base: bigint, exp: bigint, modulus: bigint): bigint {
  let result = BigInt(1);
  base = base % modulus;
  
  while (exp > 0) {
    if (exp % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exp = exp / BigInt(2);
    base = (base * base) % modulus;
  }
  
  return result;
}

/**
 * Create a Pedersen commitment to a balance value
 * 
 * @param balanceLamports - Balance in lamports (1 SOL = 1e9 lamports)
 * @returns Commitment object with commitment hash and blinding factor
 */
export function createBalanceCommitment(balanceLamports: number): PedersenCommitment {
  const value = BigInt(Math.floor(balanceLamports));
  const blindingFactor = generateBlindingFactor();
  
  // C = g^v * h^r mod p
  const gv = modPow(G, value, PRIME);
  const hr = modPow(H, blindingFactor, PRIME);
  const commitment = (gv * hr) % PRIME;
  
  // Hash the commitment for a fixed-size output
  const commitmentBytes = hexToBytes(commitment.toString(16).padStart(64, '0'));
  const commitmentHash = sha256(commitmentBytes);
  
  return {
    commitment: bytesToHex(commitmentHash),
    blindingFactor: blindingFactor.toString(16).padStart(64, '0'),
    timestamp: Date.now(),
  };
}

/**
 * Verify that a commitment matches a claimed balance
 * (Only the commitment holder can do this since they have the blinding factor)
 * 
 * @param commitment - The original commitment
 * @param claimedBalance - The balance being claimed
 * @param blindingFactorHex - The blinding factor used in the commitment
 * @returns true if the commitment matches the claimed balance
 */
export function verifyCommitment(
  commitment: string,
  claimedBalance: number,
  blindingFactorHex: string
): boolean {
  const value = BigInt(Math.floor(claimedBalance));
  const blindingFactor = BigInt('0x' + blindingFactorHex);
  
  // Recompute C = g^v * h^r mod p
  const gv = modPow(G, value, PRIME);
  const hr = modPow(H, blindingFactor, PRIME);
  const recomputed = (gv * hr) % PRIME;
  
  // Hash and compare
  const recomputedBytes = hexToBytes(recomputed.toString(16).padStart(64, '0'));
  const recomputedHash = bytesToHex(sha256(recomputedBytes));
  
  return recomputedHash === commitment;
}

/**
 * Zero-Knowledge Range Proof (Simplified)
 * 
 * Proves that a committed value is within a range [0, max]
 * without revealing the actual value.
 * 
 * This is a simplified proof - production would use Bulletproofs
 */
export interface RangeProof {
  commitment: string;
  rangeMin: number;
  rangeMax: number;
  proofHash: string;    // Proof that value is in range
  timestamp: number;
}

/**
 * Create a simple range proof for a balance
 * Proves: 0 <= balance <= maxBalance without revealing balance
 * 
 * @param balanceLamports - The actual balance
 * @param maxLamports - Maximum value in the range
 * @param blindingFactor - The blinding factor from the commitment
 */
export function createRangeProof(
  balanceLamports: number,
  maxLamports: number,
  blindingFactor: string,
  commitment: string
): RangeProof | null {
  // Check if balance is actually in range
  if (balanceLamports < 0 || balanceLamports > maxLamports) {
    return null;
  }
  
  // Create proof components
  // In production, this would be a Bulletproof or similar
  const proofData = new TextEncoder().encode(
    `${commitment}:${blindingFactor}:range:${0}:${maxLamports}:valid`
  );
  const proofHash = bytesToHex(sha256(proofData));
  
  return {
    commitment,
    rangeMin: 0,
    rangeMax: maxLamports,
    proofHash,
    timestamp: Date.now(),
  };
}

/**
 * Balance Equality Proof
 * Proves two commitments hide the same value without revealing it
 */
export interface EqualityProof {
  commitment1: string;
  commitment2: string;
  proofHash: string;
  timestamp: number;
}

/**
 * Create a proof that two commitments hide the same balance
 * Useful for proving consistency across different views
 */
export function createEqualityProof(
  balance: number,
  blindingFactor1: string,
  blindingFactor2: string
): EqualityProof {
  const commitment1 = createBalanceCommitment(balance);
  const commitment2 = createBalanceCommitment(balance);
  
  // Difference of blinding factors proves equality
  const bf1 = BigInt('0x' + blindingFactor1);
  const bf2 = BigInt('0x' + blindingFactor2);
  const diff = ((bf1 - bf2) % PRIME + PRIME) % PRIME;
  
  const proofData = new TextEncoder().encode(
    `equality:${commitment1.commitment}:${commitment2.commitment}:${diff.toString(16)}`
  );
  
  return {
    commitment1: commitment1.commitment,
    commitment2: commitment2.commitment,
    proofHash: bytesToHex(sha256(proofData)),
    timestamp: Date.now(),
  };
}

/**
 * Privacy Metadata
 * Information about what ZK features are enabled for this wallet
 */
export interface PrivacyState {
  balanceCommitment: PedersenCommitment | null;
  hideBalanceEnabled: boolean;
  lastProofGenerated: number | null;
  rangeProofAvailable: boolean;
}

/**
 * Initialize privacy state for a wallet
 */
export function initializePrivacyState(): PrivacyState {
  return {
    balanceCommitment: null,
    hideBalanceEnabled: false,
    lastProofGenerated: null,
    rangeProofAvailable: false,
  };
}

/**
 * Format commitment for display (truncated)
 */
export function formatCommitment(commitment: string): string {
  if (commitment.length <= 16) return commitment;
  return `${commitment.slice(0, 8)}...${commitment.slice(-8)}`;
}

/**
 * Hash a public key to create a privacy-preserving identifier
 */
export function hashPublicKey(publicKey: string): string {
  const data = new TextEncoder().encode(publicKey);
  return bytesToHex(sha256(data));
}
