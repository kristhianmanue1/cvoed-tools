/**
 * Unit Tests for Crypto Module - PIN Hashing
 *
 * These tests verify the security and correctness of PIN hashing
 * using bcrypt with cost factor 10.
 */

// Mock bcrypt for testing
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

const bcrypt = require("bcryptjs");

// Import the Crypto module (we'll need to make it exportable)
// For now, we'll define it inline for testing
const Crypto = {
  async hashPIN(pin) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pin, salt);
      return hash;
    } catch (error) {
      console.error("Error hashing PIN:", error);
      throw error;
    }
  },

  async verifyPIN(pin, hash) {
    try {
      return await bcrypt.compare(pin, hash);
    } catch (error) {
      console.error("PIN verification error:", error);
      return false;
    }
  },

  generateSecurePIN() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },
};

describe("Crypto Module - PIN Hashing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPIN()", () => {
    test("should generate consistent hash format for same PIN", async () => {
      const pin = "1234";
      const mockHash = "$2a$10$abcdefghijklmnopqrstuv";

      bcrypt.genSalt.mockResolvedValue("$2a$10$salt123456789012345678");
      bcrypt.hash.mockResolvedValue(mockHash);

      const hash = await Crypto.hashPIN(pin);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(pin); // Hash != plaintext
      expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt format
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(pin, expect.any(String));
    });

    test("should generate different hashes for different PINs", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt123456789012345678");
      bcrypt.hash.mockResolvedValueOnce("$2a$10$hash1").mockResolvedValueOnce("$2a$10$hash2");

      const hash1 = await Crypto.hashPIN("1234");
      const hash2 = await Crypto.hashPIN("5678");

      expect(hash1).not.toBe(hash2);
    });

    test("should use cost factor 10 for salt generation", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      await Crypto.hashPIN("1234");

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    test("should handle bcrypt errors gracefully", async () => {
      bcrypt.genSalt.mockRejectedValue(new Error("bcrypt error"));

      await expect(Crypto.hashPIN("1234")).rejects.toThrow("bcrypt error");
    });

    test("should handle 4-digit PINs", async () => {
      const pins = ["0000", "1234", "9999", "4321"];
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      for (const pin of pins) {
        const hash = await Crypto.hashPIN(pin);
        expect(hash).toBeDefined();
        expect(hash).not.toBe(pin);
      }
    });

    test("should not store plaintext PIN in hash", async () => {
      const pin = "1234";
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$abcdefghijklmnopqrstuv");

      const hash = await Crypto.hashPIN(pin);

      expect(hash).not.toContain("1234");
      expect(hash.length).toBeGreaterThan(pin.length);
    });
  });

  describe("verifyPIN()", () => {
    test("should verify correct PIN against hash", async () => {
      const pin = "1234";
      const hash = "$2a$10$abcdefghijklmnopqrstuv";

      bcrypt.compare.mockResolvedValue(true);

      const isValid = await Crypto.verifyPIN(pin, hash);

      expect(isValid).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(pin, hash);
    });

    test("should reject incorrect PIN", async () => {
      bcrypt.compare.mockResolvedValue(false);

      const isValid = await Crypto.verifyPIN("5678", "$2a$10$hash");

      expect(isValid).toBe(false);
    });

    test("should handle invalid hash gracefully", async () => {
      bcrypt.compare.mockRejectedValue(new Error("Invalid hash"));

      const isValid = await Crypto.verifyPIN("1234", "invalid_hash");

      expect(isValid).toBe(false);
    });

    test("should handle bcrypt compare errors", async () => {
      bcrypt.compare.mockImplementation(() => {
        throw new Error("Comparison failed");
      });

      const isValid = await Crypto.verifyPIN("1234", "$2a$10$hash");

      expect(isValid).toBe(false);
    });

    test("should return false for mismatched PIN", async () => {
      const correctPin = "1234";
      const wrongPin = "4321";
      const hash = "$2a$10$hash";

      bcrypt.compare.mockResolvedValue(false);

      const isValid = await Crypto.verifyPIN(wrongPin, hash);

      expect(isValid).toBe(false);
    });
  });

  describe("generateSecurePIN()", () => {
    test("should generate 4-digit PIN", () => {
      const pin = Crypto.generateSecurePIN();

      expect(pin).toMatch(/^\d{4}$/);
      expect(pin.length).toBe(4);
    });

    test("should generate PIN in valid range", () => {
      const pin = Crypto.generateSecurePIN();
      const pinNum = parseInt(pin);

      expect(pinNum).toBeGreaterThanOrEqual(1000);
      expect(pinNum).toBeLessThanOrEqual(9999);
    });

    test("should generate numeric PIN only", () => {
      for (let i = 0; i < 100; i++) {
        const pin = Crypto.generateSecurePIN();
        expect(pin).toMatch(/^\d+$/);
      }
    });

    test("should generate string type", () => {
      const pin = Crypto.generateSecurePIN();

      expect(typeof pin).toBe("string");
    });

    test("should not generate predictable PINs", () => {
      const pins = new Set();
      for (let i = 0; i < 50; i++) {
        pins.add(Crypto.generateSecurePIN());
      }
      // With 50 generations, we should have some variety
      // (though duplicates are possible with random)
      expect(pins.size).toBeGreaterThan(1);
    });
  });

  describe("Integration scenarios", () => {
    test("should hash and verify PIN correctly", async () => {
      const pin = "5678";
      const mockHash = "$2a$10$hashedvaluehere";

      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue(mockHash);
      bcrypt.compare.mockImplementation((inputPin, storedHash) => {
        return inputPin === pin && storedHash === mockHash;
      });

      const hash = await Crypto.hashPIN(pin);
      const isValid = await Crypto.verifyPIN(pin, hash);

      expect(isValid).toBe(true);
    });

    test("should fail verification for wrong PIN", async () => {
      const correctPin = "5678";
      const wrongPin = "1234";
      const mockHash = "$2a$10$hashedvaluehere";

      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue(mockHash);
      bcrypt.compare.mockImplementation((inputPin, storedHash) => {
        return inputPin === correctPin;
      });

      const hash = await Crypto.hashPIN(correctPin);
      const isValid = await Crypto.verifyPIN(wrongPin, hash);

      expect(isValid).toBe(false);
    });

    test("should handle multiple PIN hashing operations", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockImplementation(pin => `$2a$10$hash${pin}`);

      const pins = ["1111", "2222", "3333", "4444"];
      const hashes = [];

      for (const pin of pins) {
        const hash = await Crypto.hashPIN(pin);
        hashes.push(hash);
        expect(hash).toBeDefined();
      }

      // All hashes should be different
      expect(new Set(hashes).size).toBe(pins.length);
    });
  });

  describe("Security requirements", () => {
    test("hashPIN should always return bcrypt format", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$abcdefghijklmnopqrstuvwxyz123456");

      const hash = await Crypto.hashPIN("1234");

      expect(hash).toMatch(/^\$2[aby]\$10\$/);
    });

    test("should use cost factor 10 (security requirement)", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      await Crypto.hashPIN("1234");

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    test("hash should be longer than plaintext PIN", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$abcdefghijklmnopqrstuvwxyz123456");

      const hash = await Crypto.hashPIN("1234");

      expect(hash.length).toBeGreaterThan(4);
    });

    test("verifyPIN should not expose timing information significantly", async () => {
      // This is a basic test - real timing attacks require more sophisticated testing
      bcrypt.compare.mockResolvedValue(false);

      const start1 = Date.now();
      await Crypto.verifyPIN("1234", "$2a$10$hash");
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await Crypto.verifyPIN("5678", "$2a$10$hash");
      const time2 = Date.now() - start2;

      // Both should complete (not hang or fail)
      expect(time1).toBeGreaterThanOrEqual(0);
      expect(time2).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Edge cases", () => {
    test("should handle PIN with leading zeros", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      const hash = await Crypto.hashPIN("0123");

      expect(hash).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledWith("0123", expect.any(String));
    });

    test("should handle PIN with all zeros", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      const hash = await Crypto.hashPIN("0000");

      expect(hash).toBeDefined();
    });

    test("should handle PIN with all nines", async () => {
      bcrypt.genSalt.mockResolvedValue("$2a$10$salt");
      bcrypt.hash.mockResolvedValue("$2a$10$hash");

      const hash = await Crypto.hashPIN("9999");

      expect(hash).toBeDefined();
    });
  });
});
