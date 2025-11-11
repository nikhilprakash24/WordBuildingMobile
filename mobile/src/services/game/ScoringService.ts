/**
 * Scoring Service
 * Calculates scores for word submissions based on various rules
 */

import { SCORING } from '../../../../shared/constants';

export interface ScoreBreakdown {
  baseScore: number;
  lengthBonus: number;
  speedBonus?: number;
  categoryBonus?: number;
  totalScore: number;
  bonusReasons: string[];
}

export interface ScoringOptions {
  wordLength: number;
  submissionTime?: number; // milliseconds since round start
  roundDuration?: number; // total round duration in milliseconds
  isRareWord?: boolean;
  category?: string;
}

export class ScoringService {
  /**
   * Calculate score for a valid word
   */
  static calculateScore(options: ScoringOptions): ScoreBreakdown {
    const { wordLength, submissionTime, roundDuration, isRareWord } = options;

    const breakdown: ScoreBreakdown = {
      baseScore: 0,
      lengthBonus: 0,
      totalScore: 0,
      bonusReasons: [],
    };

    // Base score: points per letter
    breakdown.baseScore = wordLength * SCORING.BASE_POINTS_PER_LETTER;

    // Length bonus for long words (7+ letters)
    if (wordLength >= 7) {
      breakdown.lengthBonus = SCORING.BONUS_LONG_WORD;
      breakdown.bonusReasons.push(`Long word (+${SCORING.BONUS_LONG_WORD})`);
    }

    // Speed bonus (if submitted in first 25% of round time)
    if (submissionTime !== undefined && roundDuration !== undefined) {
      const speedThreshold = roundDuration * 0.25;
      if (submissionTime <= speedThreshold) {
        breakdown.speedBonus = 25;
        breakdown.bonusReasons.push('Fast submission (+25)');
      }
    }

    // Rare word bonus
    let rareWordBonus = 0;
    if (isRareWord) {
      rareWordBonus = SCORING.BONUS_RARE_WORD;
      breakdown.bonusReasons.push(`Rare word (+${SCORING.BONUS_RARE_WORD})`);
    }

    // Calculate total
    breakdown.totalScore =
      breakdown.baseScore +
      breakdown.lengthBonus +
      (breakdown.speedBonus || 0) +
      (breakdown.categoryBonus || 0) +
      rareWordBonus;

    return breakdown;
  }

  /**
   * Calculate penalty for invalid word
   */
  static calculatePenalty(): number {
    return SCORING.PENALTY_INVALID_WORD;
  }

  /**
   * Get score multiplier based on difficulty
   */
  static getDifficultyMultiplier(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy':
        return 1.0;
      case 'medium':
        return 1.5;
      case 'hard':
        return 2.0;
      default:
        return 1.0;
    }
  }

  /**
   * Check if a word is considered "rare" (uncommon)
   * Simple heuristic: words 8+ letters are considered rare
   */
  static isRareWord(word: string): boolean {
    return word.length >= 8;
  }

  /**
   * Get score rank based on total score
   */
  static getScoreRank(score: number): string {
    if (score >= 1000) return 'Master';
    if (score >= 750) return 'Expert';
    if (score >= 500) return 'Advanced';
    if (score >= 250) return 'Intermediate';
    if (score >= 100) return 'Beginner';
    return 'Novice';
  }

  /**
   * Calculate combo multiplier (for consecutive valid words)
   */
  static getComboMultiplier(comboCount: number): number {
    if (comboCount >= 10) return 3.0;
    if (comboCount >= 5) return 2.0;
    if (comboCount >= 3) return 1.5;
    return 1.0;
  }

  /**
   * Format score with thousands separator
   */
  static formatScore(score: number): string {
    return score.toLocaleString();
  }

  /**
   * Calculate average score per word
   */
  static calculateAverage(totalScore: number, wordCount: number): number {
    if (wordCount === 0) return 0;
    return Math.round(totalScore / wordCount);
  }
}

export default ScoringService;
