/**
 * ZK (Zero-Knowledge) Cryptography Module
 * 
 * Provides privacy-preserving cryptographic primitives for PunkZ Wallet
 */

export {
  // Commitment functions
  createBalanceCommitment,
  verifyCommitment,
  formatCommitment,
  
  // Range proofs
  createRangeProof,
  
  // Equality proofs  
  createEqualityProof,
  
  // Privacy state
  initializePrivacyState,
  
  // Utilities
  hashPublicKey,
  
  // Types
  type PedersenCommitment,
  type RangeProof,
  type EqualityProof,
  type PrivacyState,
} from './commitments';
