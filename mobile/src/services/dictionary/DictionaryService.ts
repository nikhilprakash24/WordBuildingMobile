/**
 * Dictionary Service for word validation
 * Provides offline word validation with category support
 */

import { getWordListByCategory, GENERAL_WORDS } from './wordLists';

export interface ValidationResult {
  isValid: boolean;
  word: string;
  reason?: string;
}

export interface ValidationOptions {
  category?: string;
  minLength?: number;
  maxLength?: number;
  allowProperNouns?: boolean;
}

export class DictionaryService {
  /**
   * Validate a word against the dictionary
   */
  static validateWord(
    word: string,
    options: ValidationOptions = {}
  ): ValidationResult {
    const {
      category = 'general',
      minLength = 3,
      maxLength = 15,
      allowProperNouns = false,
    } = options;

    // Normalize word (lowercase, trim)
    const normalizedWord = word.toLowerCase().trim();

    // Check if word is empty
    if (!normalizedWord) {
      return {
        isValid: false,
        word,
        reason: 'Word cannot be empty',
      };
    }

    // Check length constraints
    if (normalizedWord.length < minLength) {
      return {
        isValid: false,
        word,
        reason: `Word must be at least ${minLength} letters`,
      };
    }

    if (normalizedWord.length > maxLength) {
      return {
        isValid: false,
        word,
        reason: `Word must be at most ${maxLength} letters`,
      };
    }

    // Check if word contains only letters
    if (!/^[a-z]+$/.test(normalizedWord)) {
      return {
        isValid: false,
        word,
        reason: 'Word must contain only letters',
      };
    }

    // Note: Proper noun checking removed for better UX
    // Players can type in any case and words are normalized

    // Get appropriate word list
    const wordList = getWordListByCategory(category);

    // Check if word exists in dictionary
    if (!wordList.has(normalizedWord)) {
      return {
        isValid: false,
        word,
        reason: `Word not found in ${category} dictionary`,
      };
    }

    return {
      isValid: true,
      word: normalizedWord,
    };
  }

  /**
   * Check if a word exists in general dictionary
   */
  static isValidWord(word: string): boolean {
    const normalizedWord = word.toLowerCase().trim();
    return GENERAL_WORDS.has(normalizedWord);
  }

  /**
   * Check if a word exists in a specific category
   */
  static isValidForCategory(word: string, category: string): boolean {
    const normalizedWord = word.toLowerCase().trim();
    const wordList = getWordListByCategory(category);
    return wordList.has(normalizedWord);
  }

  /**
   * Get suggestions for a misspelled word (simple implementation)
   * Returns words that are similar (within edit distance of 1)
   */
  static getSuggestions(word: string, category = 'general'): string[] {
    const normalizedWord = word.toLowerCase().trim();
    const wordList = getWordListByCategory(category);
    const suggestions: string[] = [];

    // Only suggest if word is reasonably long
    if (normalizedWord.length < 3) {
      return suggestions;
    }

    // Find words with same length
    for (const dictWord of wordList) {
      if (Math.abs(dictWord.length - normalizedWord.length) <= 1) {
        const distance = this.getEditDistance(normalizedWord, dictWord);
        if (distance === 1) {
          suggestions.push(dictWord);
        }
      }

      // Limit suggestions
      if (suggestions.length >= 5) {
        break;
      }
    }

    return suggestions;
  }

  /**
   * Calculate edit distance between two words (Levenshtein distance)
   */
  private static getEditDistance(word1: string, word2: string): number {
    const len1 = word1.length;
    const len2 = word2.length;
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1, // deletion
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Get random word from a category (useful for hints)
   */
  static getRandomWord(category = 'general'): string {
    const wordList = getWordListByCategory(category);
    const words = Array.from(wordList);
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  /**
   * Get word count for a category
   */
  static getWordCount(category = 'general'): number {
    const wordList = getWordListByCategory(category);
    return wordList.size;
  }
}

export default DictionaryService;
