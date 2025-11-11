/**
 * DictionaryService Tests
 */

import { DictionaryService } from '../DictionaryService';

describe('DictionaryService', () => {
  describe('validateWord', () => {
    it('should validate a correct word in general dictionary', () => {
      const result = DictionaryService.validateWord('cat');
      expect(result.isValid).toBe(true);
      expect(result.word).toBe('cat');
    });

    it('should normalize word to lowercase', () => {
      const result = DictionaryService.validateWord('CAT');
      expect(result.isValid).toBe(true);
      expect(result.word).toBe('cat');
    });

    it('should trim whitespace', () => {
      const result = DictionaryService.validateWord('  dog  ');
      expect(result.isValid).toBe(true);
      expect(result.word).toBe('dog');
    });

    it('should reject empty words', () => {
      const result = DictionaryService.validateWord('');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Word cannot be empty');
    });

    it('should reject words that are too short', () => {
      const result = DictionaryService.validateWord('ab', { minLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('at least 3');
    });

    it('should reject words that are too long', () => {
      const result = DictionaryService.validateWord('verylongword', {
        maxLength: 5,
      });
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('at most 5');
    });

    it('should reject words with non-letter characters', () => {
      const result = DictionaryService.validateWord('cat123');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Word must contain only letters');
    });

    it('should normalize capitalized words (proper noun check removed)', () => {
      // Proper noun checking removed for better UX - words are just normalized
      const result = DictionaryService.validateWord('Paris');
      expect(result.isValid).toBe(false);
      // Should fail because 'paris' not in dictionary, not because of capitalization
      expect(result.reason).toContain('not found');
    });

    it('should accept capitalized valid words', () => {
      // Words in dictionary should work regardless of capitalization
      const result = DictionaryService.validateWord('Cat');
      expect(result.isValid).toBe(true);
      expect(result.word).toBe('cat');
    });

    it('should reject words not in dictionary', () => {
      const result = DictionaryService.validateWord('xyz');
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('not found');
    });

    it('should validate word in specific category', () => {
      const result = DictionaryService.validateWord('lion', {
        category: 'animals',
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject word in wrong category', () => {
      const result = DictionaryService.validateWord('computer', {
        category: 'animals',
      });
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('animals dictionary');
    });
  });

  describe('isValidWord', () => {
    it('should return true for valid words', () => {
      expect(DictionaryService.isValidWord('cat')).toBe(true);
      expect(DictionaryService.isValidWord('dog')).toBe(true);
      expect(DictionaryService.isValidWord('house')).toBe(true);
    });

    it('should return false for invalid words', () => {
      expect(DictionaryService.isValidWord('xyz')).toBe(false);
      expect(DictionaryService.isValidWord('asdfgh')).toBe(false);
    });

    it('should normalize before checking', () => {
      expect(DictionaryService.isValidWord('CAT')).toBe(true);
      expect(DictionaryService.isValidWord('  dog  ')).toBe(true);
    });
  });

  describe('isValidForCategory', () => {
    it('should validate animal words in animals category', () => {
      expect(DictionaryService.isValidForCategory('cat', 'animals')).toBe(true);
      expect(DictionaryService.isValidForCategory('lion', 'animals')).toBe(
        true
      );
    });

    it('should reject non-animal words in animals category', () => {
      expect(DictionaryService.isValidForCategory('computer', 'animals')).toBe(
        false
      );
    });

    it('should validate food words in food category', () => {
      expect(DictionaryService.isValidForCategory('pizza', 'food')).toBe(true);
      expect(DictionaryService.isValidForCategory('bread', 'food')).toBe(true);
    });
  });

  describe('getRandomWord', () => {
    it('should return a word from general category', () => {
      const word = DictionaryService.getRandomWord();
      expect(typeof word).toBe('string');
      expect(word.length).toBeGreaterThan(0);
      expect(DictionaryService.isValidWord(word)).toBe(true);
    });

    it('should return a word from specific category', () => {
      const word = DictionaryService.getRandomWord('animals');
      expect(typeof word).toBe('string');
      expect(DictionaryService.isValidForCategory(word, 'animals')).toBe(true);
    });
  });

  describe('getWordCount', () => {
    it('should return word count for general category', () => {
      const count = DictionaryService.getWordCount();
      expect(count).toBeGreaterThan(0);
    });

    it('should return word count for specific category', () => {
      const count = DictionaryService.getWordCount('animals');
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for misspelled words', () => {
      const suggestions = DictionaryService.getSuggestions('cet'); // close to 'cat'
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should return empty array for very short words', () => {
      const suggestions = DictionaryService.getSuggestions('ab');
      expect(suggestions).toEqual([]);
    });

    it('should limit suggestions to 5', () => {
      const suggestions = DictionaryService.getSuggestions('cat');
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });
});
