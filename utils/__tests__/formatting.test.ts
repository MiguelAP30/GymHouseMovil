import { formatDate, formatCurrency, formatPhoneNumber } from '../formatting';

describe('Formatting Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      // This test expects UTC output
      const date = new Date(Date.UTC(2024, 2, 15)); // March is month 2 in JS Date (0-indexed)
      expect(formatDate(date)).toBe('15/03/2024');
    });

    it('handles different date formats', () => {
      // This test expects UTC output
      const date = new Date(Date.UTC(2024, 2, 15, 10, 30));
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-15');
      expect(formatDate(date, 'DD/MM/YYYY HH:mm')).toBe('15/03/2024 10:30');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1000.50)).toBe('$1,000.50');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'MXN')).toBe('MX$1,000.00');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('1234567890', 'MX')).toBe('+52 (123) 456-7890');
    });

    it('handles invalid phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('')).toBe('');
    });
  });
}); 