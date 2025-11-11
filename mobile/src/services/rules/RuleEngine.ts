/**
 * Rule Engine Service
 * Manages game rules, validation, and rule set application
 */

import type { Rule, RuleSet, RuleValidators, RuleValidationResult, GameMode, RuleValidator } from '../../../../shared/types/rules.types';
import { RuleType } from '../../../../shared/types/rules.types';

export class RuleEngine {
  private static validators: RuleValidators = {
    // Word validation rules
    noRepeatedWords: (word: string, context: { submittedWords: string[] }) => {
      return !context.submittedWords.includes(word.toLowerCase());
    },

    minLength: (word: string, context: { minLength: number }) => {
      return word.length >= context.minLength;
    },

    maxLength: (word: string, context: { maxLength: number }) => {
      return word.length <= context.maxLength;
    },

    mustStartWith: (word: string, context: { letter: string }) => {
      return word.toLowerCase().startsWith(context.letter.toLowerCase());
    },

    mustEndWith: (word: string, context: { letter: string }) => {
      return word.toLowerCase().endsWith(context.letter.toLowerCase());
    },

    mustContain: (word: string, context: { letters: string }) => {
      const wordLower = word.toLowerCase();
      return context.letters.toLowerCase().split('').every(letter => wordLower.includes(letter));
    },

    noVowels: (word: string) => {
      return !/[aeiou]/i.test(word);
    },

    noConsonants: (word: string) => {
      return !/[bcdfghjklmnpqrstvwxyz]/i.test(word);
    },

    palindrome: (word: string) => {
      const normalized = word.toLowerCase();
      return normalized === normalized.split('').reverse().join('');
    },

    uniqueLetters: (word: string) => {
      const letters = word.toLowerCase().split('');
      return new Set(letters).size === letters.length;
    },
  };

  /**
   * Register a custom validator
   */
  static registerValidator(name: string, validator: RuleValidator) {
    this.validators[name] = validator;
  }

  /**
   * Apply a rule to validate a word
   */
  static applyRule(rule: Rule, word: string, context: any): boolean {
    if (!rule.enabled) return true;

    const validatorName = rule.config?.validator || rule.id;
    const validator = this.validators[validatorName];

    if (!validator) {
      console.warn(`Validator '${validatorName}' not found for rule '${rule.id}'`);
      return true; // Pass if validator not found
    }

    try {
      return validator(word, { ...context, ...rule.config });
    } catch (error) {
      console.error(`Error applying rule '${rule.id}':`, error);
      return true; // Pass on error to avoid blocking gameplay
    }
  }

  /**
   * Apply all rules in a rule set
   */
  static applyRuleSet(
    ruleSet: RuleSet,
    word: string,
    context: any
  ): { isValid: boolean; failedRules: Rule[] } {
    const failedRules: Rule[] = [];

    for (const rule of ruleSet.rules) {
      if (!this.applyRule(rule, word, context)) {
        failedRules.push(rule);
      }
    }

    return {
      isValid: failedRules.length === 0,
      failedRules,
    };
  }

  /**
   * Validate a rule set for consistency
   */
  static validateRuleSet(ruleSet: RuleSet): RuleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for conflicting rules
    const hasNoVowels = ruleSet.rules.some(r => r.id === 'noVowels' && r.enabled);
    const hasNoConsonants = ruleSet.rules.some(r => r.id === 'noConsonants' && r.enabled);

    if (hasNoVowels && hasNoConsonants) {
      errors.push('Cannot enable both "No Vowels" and "No Consonants" rules');
    }

    // Check for impossible combinations
    const minLengthRule = ruleSet.rules.find(r => r.id === 'minLength' && r.enabled);
    const maxLengthRule = ruleSet.rules.find(r => r.id === 'maxLength' && r.enabled);

    if (minLengthRule && maxLengthRule) {
      const minLength = minLengthRule.config?.minLength || 0;
      const maxLength = maxLengthRule.config?.maxLength || 0;

      if (minLength > maxLength) {
        errors.push('Minimum length cannot be greater than maximum length');
      }
    }

    // Check for unique letters + palindrome (very hard)
    const hasUniqueLetters = ruleSet.rules.some(r => r.id === 'uniqueLetters' && r.enabled);
    const hasPalindrome = ruleSet.rules.some(r => r.id === 'palindrome' && r.enabled);

    if (hasUniqueLetters && hasPalindrome) {
      warnings.push('Combining "Unique Letters" and "Palindrome" is very difficult');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get scoring multiplier from rules
   */
  static getScoringMultiplier(ruleSet: RuleSet): number {
    let multiplier = 1.0;

    for (const rule of ruleSet.rules) {
      if (rule.type === RuleType.SCORING && rule.enabled && rule.config?.multiplier) {
        multiplier *= rule.config.multiplier;
      }
    }

    return multiplier;
  }

  /**
   * Merge rule sets (for custom game creation)
   */
  static mergeRuleSets(base: RuleSet, override: Partial<RuleSet>): RuleSet {
    return {
      ...base,
      ...override,
      rules: override.rules || base.rules,
      config: {
        ...base.config,
        ...(override.config || {}),
      },
    };
  }
}

export default RuleEngine;
