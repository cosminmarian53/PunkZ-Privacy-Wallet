import { describe, it, expect } from 'vitest';
import { 
  createBalanceCommitment, 
  verifyCommitment,
  createRangeProof
} from './commitments';

describe('ZK Commitments', () => {
  describe('createBalanceCommitment', () => {
    it('should create a valid commitment for a positive balance', () => {
      const balance = 1000000000; // 1 SOL in lamports
      const commitment = createBalanceCommitment(balance);
      
      expect(commitment).toBeDefined();
      expect(commitment.commitment).toBeDefined();
      expect(commitment.blindingFactor).toBeDefined();
      expect(commitment.timestamp).toBeDefined();
      expect(typeof commitment.commitment).toBe('string');
      expect(commitment.commitment.length).toBe(64); // 256-bit hash = 64 hex chars
    });

    it('should create a valid commitment for zero balance', () => {
      const balance = 0;
      const commitment = createBalanceCommitment(balance);
      
      expect(commitment).toBeDefined();
      expect(commitment.commitment).toBeDefined();
    });

    it('should create different commitments for same balance due to random blinding factor', () => {
      const balance = 500000000; // 0.5 SOL
      const commitment1 = createBalanceCommitment(balance);
      const commitment2 = createBalanceCommitment(balance);
      
      // Commitments should be different due to random blinding factors
      expect(commitment1.commitment).not.toBe(commitment2.commitment);
      expect(commitment1.blindingFactor).not.toBe(commitment2.blindingFactor);
    });

    it('should handle negative balances by treating them as zero', () => {
      const balance = -100;
      const commitment = createBalanceCommitment(balance);
      
      expect(commitment).toBeDefined();
      expect(commitment.commitment).toBeDefined();
    });
  });

  describe('verifyCommitment', () => {
    it('should verify a valid commitment', () => {
      const balance = 1000000000; // 1 SOL
      const commitment = createBalanceCommitment(balance);
      
      const isValid = verifyCommitment(
        commitment.commitment,
        balance,
        commitment.blindingFactor
      );
      
      expect(isValid).toBe(true);
    });

    it('should reject commitment with wrong balance', () => {
      const actualBalance = 1000000000; // 1 SOL
      const claimedBalance = 2000000000; // 2 SOL (wrong)
      const commitment = createBalanceCommitment(actualBalance);
      
      const isValid = verifyCommitment(
        commitment.commitment,
        claimedBalance,
        commitment.blindingFactor
      );
      
      expect(isValid).toBe(false);
    });

    it('should reject commitment with wrong blinding factor', () => {
      const balance = 1000000000;
      const commitment = createBalanceCommitment(balance);
      
      // Use a different blinding factor
      const wrongBlindingFactor = 'a'.repeat(64);
      
      const isValid = verifyCommitment(
        commitment.commitment,
        balance,
        wrongBlindingFactor
      );
      
      expect(isValid).toBe(false);
    });

    it('should work with various balance amounts', () => {
      const balances = [0, 1, 1000, 1000000, 1000000000, 100000000000];
      
      for (const balance of balances) {
        const commitment = createBalanceCommitment(balance);
        const isValid = verifyCommitment(
          commitment.commitment,
          balance,
          commitment.blindingFactor
        );
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Range Proofs', () => {
    it('should generate a valid range proof', () => {
      const balance = 1000000000;
      const maxBalance = 10000000000;
      const commitment = createBalanceCommitment(balance);
      
      const proof = createRangeProof(
        balance,
        maxBalance,
        commitment.blindingFactor,
        commitment.commitment
      );
      
      expect(proof).toBeDefined();
      expect(proof).not.toBeNull();
      expect(proof?.commitment).toBe(commitment.commitment);
      expect(proof?.rangeMin).toBe(0);
      expect(proof?.rangeMax).toBe(maxBalance);
    });

    it('should return null for out-of-range balance', () => {
      const balance = 1000000000;
      const maxBalance = 500000000; // Less than balance
      const commitment = createBalanceCommitment(balance);
      
      const proof = createRangeProof(
        balance,
        maxBalance,
        commitment.blindingFactor,
        commitment.commitment
      );
      
      expect(proof).toBeNull();
    });
  });
});
