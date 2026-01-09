import { describe, it, expect } from 'vitest';
import { 
  generateStealthKeys,
  generateStealthAddress,
  parseStealthMetaAddress,
  scanForStealthPayments,
  deriveStealthSpendingKey
} from './stealth';

describe('Stealth Addresses', () => {
  describe('generateStealthKeys', () => {
    it('should generate valid stealth keys', () => {
      const keys = generateStealthKeys();
      
      expect(keys).toBeDefined();
      expect(keys.spendingPrivateKey).toBeDefined();
      expect(keys.viewingPrivateKey).toBeDefined();
      expect(keys.metaAddress).toBeDefined();
      expect(keys.metaAddress.spendingPublicKey).toBeDefined();
      expect(keys.metaAddress.viewingPublicKey).toBeDefined();
    });

    it('should generate unique keys each time', () => {
      const keys1 = generateStealthKeys();
      const keys2 = generateStealthKeys();
      
      expect(keys1.spendingPrivateKey).not.toBe(keys2.spendingPrivateKey);
      expect(keys1.viewingPrivateKey).not.toBe(keys2.viewingPrivateKey);
    });

    it('should generate meta-address in correct format', () => {
      const keys = generateStealthKeys();
      
      // Meta-address format: st:spendingPubKey:viewingPubKey
      expect(keys.metaAddress.metaAddress.startsWith('st:')).toBe(true);
      const parts = keys.metaAddress.metaAddress.split(':');
      expect(parts.length).toBe(3);
    });
  });

  describe('generateStealthAddress', () => {
    it('should generate a valid stealth address from meta-address', () => {
      const receiverKeys = generateStealthKeys();
      const stealthAddr = generateStealthAddress(receiverKeys.metaAddress.metaAddress);
      
      expect(stealthAddr).toBeDefined();
      expect(stealthAddr).not.toBeNull();
      expect(stealthAddr?.address).toBeDefined();
      expect(stealthAddr?.ephemeralPublicKey).toBeDefined();
      expect(stealthAddr?.sharedSecretHash).toBeDefined();
      expect(stealthAddr?.metaAddress).toBe(receiverKeys.metaAddress.metaAddress);
    });

    it('should generate different addresses each time', () => {
      const receiverKeys = generateStealthKeys();
      const addr1 = generateStealthAddress(receiverKeys.metaAddress.metaAddress);
      const addr2 = generateStealthAddress(receiverKeys.metaAddress.metaAddress);
      
      // Each call should produce a unique one-time address
      expect(addr1?.address).not.toBe(addr2?.address);
      expect(addr1?.ephemeralPublicKey).not.toBe(addr2?.ephemeralPublicKey);
    });
  });

  describe('parseStealthMetaAddress', () => {
    it('should parse a valid meta-address', () => {
      const keys = generateStealthKeys();
      const parsed = parseStealthMetaAddress(keys.metaAddress.metaAddress);
      
      expect(parsed).not.toBeNull();
      expect(parsed?.spendingPublicKey).toBe(keys.metaAddress.spendingPublicKey);
      expect(parsed?.viewingPublicKey).toBe(keys.metaAddress.viewingPublicKey);
    });

    it('should return null for invalid meta-address', () => {
      const invalid = 'not-a-valid-meta-address';
      const parsed = parseStealthMetaAddress(invalid);
      
      expect(parsed).toBeNull();
    });

    it('should return null for meta-address with wrong prefix', () => {
      const wrongPrefix = 'xx:abc123:def456';
      const parsed = parseStealthMetaAddress(wrongPrefix);
      
      expect(parsed).toBeNull();
    });
  });

  describe('scanForStealthPayments', () => {
    it('should scan and derive stealth addresses from ephemeral keys', () => {
      const receiverKeys = generateStealthKeys();
      
      // Simulate a sender creating a stealth address
      const stealthAddr = generateStealthAddress(receiverKeys.metaAddress.metaAddress);
      
      if (!stealthAddr) {
        throw new Error('Failed to generate stealth address');
      }
      
      // Receiver scans for payments using the ephemeral key
      const detected = scanForStealthPayments(
        receiverKeys,
        [stealthAddr.ephemeralPublicKey]
      );
      
      // Should detect one payment
      expect(detected.length).toBe(1);
      // The detected address should be a valid Solana address (44 chars)
      expect(detected[0].stealthAddress.length).toBeGreaterThanOrEqual(32);
      expect(detected[0].ephemeralPublicKey).toBe(stealthAddr.ephemeralPublicKey);
    });
  });

  describe('deriveStealthSpendingKey', () => {
    it('should derive spending key for a stealth address', () => {
      const receiverKeys = generateStealthKeys();
      const stealthAddr = generateStealthAddress(receiverKeys.metaAddress.metaAddress);
      
      if (!stealthAddr) {
        throw new Error('Failed to generate stealth address');
      }
      
      // Derive the spending key for this stealth address
      const spendingKeypair = deriveStealthSpendingKey(
        receiverKeys,
        stealthAddr.ephemeralPublicKey
      );
      
      expect(spendingKeypair).not.toBeNull();
      // The derived keypair should be a valid keypair
      expect(spendingKeypair?.publicKey).toBeDefined();
      expect(spendingKeypair?.secretKey).toBeDefined();
      expect(spendingKeypair?.secretKey.length).toBe(64);
    });
  });
});
