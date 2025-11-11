/**
 * ScoringService Tests
 */

import { ScoringService } from '../ScoringService';
import { SCORING } from '../../../../../shared/constants';

describe('ScoringService', () => {
  describe('calculateScore', () => {
    it('should calculate base score correctly', () => {
      const result = ScoringService.calculateScore({ wordLength: 5 });
      expect(result.baseScore).toBe(5 * SCORING.BASE_POINTS_PER_LETTER);
      expect(result.totalScore).toBe(5 * SCORING.BASE_POINTS_PER_LETTER);
    });

    it('should add length bonus for long words (7+ letters)', () => {
      const result = ScoringService.calculateScore({ wordLength: 7 });
      expect(result.lengthBonus).toBe(SCORING.BONUS_LONG_WORD);
      expect(result.bonusReasons).toContain(
        `Long word (+${SCORING.BONUS_LONG_WORD})`
      );
      expect(result.totalScore).toBe(
        7 * SCORING.BASE_POINTS_PER_LETTER + SCORING.BONUS_LONG_WORD
      );
    });

    it('should not add length bonus for short words', () => {
      const result = ScoringService.calculateScore({ wordLength: 5 });
      expect(result.lengthBonus).toBe(0);
      expect(result.bonusReasons).not.toContain('Long word');
    });

    it('should add speed bonus for fast submissions', () => {
      const roundDuration = 120000; // 2 minutes
      const submissionTime = 15000; // 15 seconds (within 25% threshold)

      const result = ScoringService.calculateScore({
        wordLength: 5,
        submissionTime,
        roundDuration,
      });

      expect(result.speedBonus).toBe(25);
      expect(result.bonusReasons).toContain('Fast submission (+25)');
    });

    it('should not add speed bonus for slow submissions', () => {
      const roundDuration = 120000; // 2 minutes
      const submissionTime = 60000; // 1 minute (beyond 25% threshold)

      const result = ScoringService.calculateScore({
        wordLength: 5,
        submissionTime,
        roundDuration,
      });

      expect(result.speedBonus).toBeUndefined();
    });

    it('should add rare word bonus', () => {
      const result = ScoringService.calculateScore({
        wordLength: 5,
        isRareWord: true,
      });

      expect(result.totalScore).toBe(
        5 * SCORING.BASE_POINTS_PER_LETTER + SCORING.BONUS_RARE_WORD
      );
      expect(result.bonusReasons).toContain(
        `Rare word (+${SCORING.BONUS_RARE_WORD})`
      );
    });

    it('should combine multiple bonuses correctly', () => {
      const result = ScoringService.calculateScore({
        wordLength: 8,
        submissionTime: 10000,
        roundDuration: 120000,
        isRareWord: true,
      });

      const expectedTotal =
        8 * SCORING.BASE_POINTS_PER_LETTER + // base
        SCORING.BONUS_LONG_WORD + // length
        25 + // speed
        SCORING.BONUS_RARE_WORD; // rare word

      expect(result.totalScore).toBe(expectedTotal);
      expect(result.bonusReasons.length).toBeGreaterThan(0);
    });
  });

  describe('calculatePenalty', () => {
    it('should return negative penalty value', () => {
      const penalty = ScoringService.calculatePenalty();
      expect(penalty).toBe(SCORING.PENALTY_INVALID_WORD);
      expect(penalty).toBeLessThan(0);
    });
  });

  describe('getDifficultyMultiplier', () => {
    it('should return 1.0 for easy', () => {
      expect(ScoringService.getDifficultyMultiplier('easy')).toBe(1.0);
    });

    it('should return 1.5 for medium', () => {
      expect(ScoringService.getDifficultyMultiplier('medium')).toBe(1.5);
    });

    it('should return 2.0 for hard', () => {
      expect(ScoringService.getDifficultyMultiplier('hard')).toBe(2.0);
    });
  });

  describe('isRareWord', () => {
    it('should return true for words 8+ letters', () => {
      expect(ScoringService.isRareWord('computer')).toBe(true);
      expect(ScoringService.isRareWord('elephant')).toBe(true);
    });

    it('should return false for words less than 8 letters', () => {
      expect(ScoringService.isRareWord('cat')).toBe(false);
      expect(ScoringService.isRareWord('house')).toBe(false);
    });
  });

  describe('getScoreRank', () => {
    it('should return correct ranks', () => {
      expect(ScoringService.getScoreRank(1200)).toBe('Master');
      expect(ScoringService.getScoreRank(800)).toBe('Expert');
      expect(ScoringService.getScoreRank(600)).toBe('Advanced');
      expect(ScoringService.getScoreRank(300)).toBe('Intermediate');
      expect(ScoringService.getScoreRank(150)).toBe('Beginner');
      expect(ScoringService.getScoreRank(50)).toBe('Novice');
    });
  });

  describe('getComboMultiplier', () => {
    it('should return 1.0 for combos less than 3', () => {
      expect(ScoringService.getComboMultiplier(0)).toBe(1.0);
      expect(ScoringService.getComboMultiplier(1)).toBe(1.0);
      expect(ScoringService.getComboMultiplier(2)).toBe(1.0);
    });

    it('should return 1.5 for combos 3-4', () => {
      expect(ScoringService.getComboMultiplier(3)).toBe(1.5);
      expect(ScoringService.getComboMultiplier(4)).toBe(1.5);
    });

    it('should return 2.0 for combos 5-9', () => {
      expect(ScoringService.getComboMultiplier(5)).toBe(2.0);
      expect(ScoringService.getComboMultiplier(9)).toBe(2.0);
    });

    it('should return 3.0 for combos 10+', () => {
      expect(ScoringService.getComboMultiplier(10)).toBe(3.0);
      expect(ScoringService.getComboMultiplier(20)).toBe(3.0);
    });
  });

  describe('formatScore', () => {
    it('should format score with thousands separator', () => {
      expect(ScoringService.formatScore(1000)).toContain('1');
      expect(ScoringService.formatScore(1000)).toContain('000');
    });
  });

  describe('calculateAverage', () => {
    it('should calculate average correctly', () => {
      expect(ScoringService.calculateAverage(100, 5)).toBe(20);
      expect(ScoringService.calculateAverage(250, 10)).toBe(25);
    });

    it('should return 0 for zero words', () => {
      expect(ScoringService.calculateAverage(100, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(ScoringService.calculateAverage(100, 3)).toBe(33);
    });
  });
});
