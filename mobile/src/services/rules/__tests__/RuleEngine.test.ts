/**
 * RuleEngine Tests
 */

import { RuleEngine } from '../RuleEngine';
import { Rule, RuleSet, GameMode, RuleType } from '../../../../../shared/types/rules.types';

describe('RuleEngine', () => {
  describe('Built-in validators', () => {
    it('should validate noRepeatedWords', () => {
      const rule: Rule = {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      };

      const context = { submittedWords: ['cat', 'dog'] };

      expect(RuleEngine.applyRule(rule, 'cat', context)).toBe(false);
      expect(RuleEngine.applyRule(rule, 'bird', context)).toBe(true);
    });

    it('should validate minLength', () => {
      const rule: Rule = {
        id: 'minLength',
        name: 'Min Length',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 5 },
      };

      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(false);
      expect(RuleEngine.applyRule(rule, 'house', {})).toBe(true);
    });

    it('should validate maxLength', () => {
      const rule: Rule = {
        id: 'maxLength',
        name: 'Max Length',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { maxLength: 5 },
      };

      expect(RuleEngine.applyRule(rule, 'elephant', {})).toBe(false);
      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(true);
    });

    it('should validate mustStartWith', () => {
      const rule: Rule = {
        id: 'mustStartWith',
        name: 'Must Start With',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { letter: 'C', validator: 'mustStartWith' },
      };

      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'dog', {})).toBe(false);
      expect(RuleEngine.applyRule(rule, 'Cat', {})).toBe(true); // Case insensitive
    });

    it('should validate mustEndWith', () => {
      const rule: Rule = {
        id: 'mustEndWith',
        name: 'Must End With',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { letter: 'T', validator: 'mustEndWith' },
      };

      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'dog', {})).toBe(false);
    });

    it('should validate palindrome', () => {
      const rule: Rule = {
        id: 'palindrome',
        name: 'Palindrome',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { validator: 'palindrome' },
      };

      expect(RuleEngine.applyRule(rule, 'racecar', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'level', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(false);
    });

    it('should validate uniqueLetters', () => {
      const rule: Rule = {
        id: 'uniqueLetters',
        name: 'Unique Letters',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { validator: 'uniqueLetters' },
      };

      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'book', {})).toBe(false); // 'o' repeats
    });
  });

  describe('applyRuleSet', () => {
    it('should apply all rules in a rule set', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'minLength',
            name: 'Min',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
            config: { minLength: 3 },
          },
          {
            id: 'maxLength',
            name: 'Max',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
            config: { maxLength: 10 },
          },
        ],
      };

      const result1 = RuleEngine.applyRuleSet(ruleSet, 'cat', {});
      expect(result1.isValid).toBe(true);
      expect(result1.failedRules).toHaveLength(0);

      const result2 = RuleEngine.applyRuleSet(ruleSet, 'ab', {});
      expect(result2.isValid).toBe(false);
      expect(result2.failedRules).toHaveLength(1);
      expect(result2.failedRules[0].id).toBe('minLength');

      const result3 = RuleEngine.applyRuleSet(ruleSet, 'verylongword', {});
      expect(result3.isValid).toBe(false);
      expect(result3.failedRules).toHaveLength(1);
      expect(result3.failedRules[0].id).toBe('maxLength');
    });

    it('should skip disabled rules', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'minLength',
            name: 'Min',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: false, // Disabled
            overridable: true,
            config: { minLength: 10 },
          },
        ],
      };

      const result = RuleEngine.applyRuleSet(ruleSet, 'cat', {});
      expect(result.isValid).toBe(true); // Passes because rule is disabled
    });
  });

  describe('validateRuleSet', () => {
    it('should detect conflicting rules (noVowels + noConsonants)', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'noVowels',
            name: 'No Vowels',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
          },
          {
            id: 'noConsonants',
            name: 'No Consonants',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
          },
        ],
      };

      const result = RuleEngine.validateRuleSet(ruleSet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Cannot enable both "No Vowels" and "No Consonants" rules'
      );
    });

    it('should detect impossible length combinations', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'minLength',
            name: 'Min',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
            config: { minLength: 10 },
          },
          {
            id: 'maxLength',
            name: 'Max',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
            config: { maxLength: 5 },
          },
        ],
      };

      const result = RuleEngine.validateRuleSet(ruleSet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Minimum length cannot be greater than maximum length'
      );
    });

    it('should warn about difficult combinations', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'uniqueLetters',
            name: 'Unique',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
          },
          {
            id: 'palindrome',
            name: 'Palindrome',
            description: 'Test',
            type: RuleType.VALIDATION,
            enabled: true,
            overridable: true,
          },
        ],
      };

      const result = RuleEngine.validateRuleSet(ruleSet);
      expect(result.isValid).toBe(true); // Valid but has warnings
      expect(result.warnings).toContain(
        'Combining "Unique Letters" and "Palindrome" is very difficult'
      );
    });
  });

  describe('getScoringMultiplier', () => {
    it('should calculate scoring multiplier from rules', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [
          {
            id: 'hardMode',
            name: 'Hard',
            description: 'Test',
            type: RuleType.SCORING,
            enabled: true,
            overridable: false,
            config: { multiplier: 1.5 },
          },
          {
            id: 'expertMode',
            name: 'Expert',
            description: 'Test',
            type: RuleType.SCORING,
            enabled: true,
            overridable: false,
            config: { multiplier: 2.0 },
          },
        ],
      };

      const multiplier = RuleEngine.getScoringMultiplier(ruleSet);
      expect(multiplier).toBe(3.0); // 1.5 * 2.0
    });

    it('should return 1.0 if no scoring rules', () => {
      const ruleSet: RuleSet = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED },
        rules: [],
      };

      const multiplier = RuleEngine.getScoringMultiplier(ruleSet);
      expect(multiplier).toBe(1.0);
    });
  });

  describe('mergeRuleSets', () => {
    it('should merge rule sets correctly', () => {
      const base: RuleSet = {
        id: 'base',
        name: 'Base',
        description: 'Base',
        gameMode: GameMode.TIMER_BASED,
        config: { mode: GameMode.TIMER_BASED, roundDuration: 120 },
        rules: [],
      };

      const override: Partial<RuleSet> = {
        name: 'Custom',
        config: { mode: GameMode.TIMER_BASED, roundDuration: 180 },
      };

      const merged = RuleEngine.mergeRuleSets(base, override);

      expect(merged.name).toBe('Custom');
      expect(merged.config.roundDuration).toBe(180);
      expect(merged.config.mode).toBe(GameMode.TIMER_BASED); // Preserved from base
    });
  });

  describe('Custom validators', () => {
    it('should allow registering custom validators', () => {
      RuleEngine.registerValidator('customTest', (word: string) => {
        return word.length === 5;
      });

      const rule: Rule = {
        id: 'customTest',
        name: 'Custom',
        description: 'Test',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
      };

      expect(RuleEngine.applyRule(rule, 'hello', {})).toBe(true);
      expect(RuleEngine.applyRule(rule, 'cat', {})).toBe(false);
    });
  });
});
