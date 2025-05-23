import { validateEmail, validatePassword, validatePhone } from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('missing@domain')).toBe(false);
      expect(validateEmail('@missing-local.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns true for valid passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('StrongP@ss1')).toBe(true);
    });

    it('returns false for invalid passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('no-numbers')).toBe(false);
      expect(validatePassword('NoSpecialChars1')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('returns true for valid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+52 123 456 7890')).toBe(true);
    });

    it('returns false for invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });
}); 