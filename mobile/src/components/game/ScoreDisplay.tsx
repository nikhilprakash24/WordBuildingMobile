/**
 * ScoreDisplay Component
 * Shows current score and game statistics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { GameStats } from '../../store';

interface ScoreDisplayProps {
  stats: GameStats;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainScore}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{stats.totalScore}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.validWords}</Text>
          <Text style={styles.statLabel}>Valid</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.statValueInvalid]}>
            {stats.invalidWords}
          </Text>
          <Text style={styles.statLabel}>Invalid</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.averageScore}</Text>
          <Text style={styles.statLabel}>Avg</Text>
        </View>
      </View>

      {stats.comboCount > 1 && (
        <View style={styles.comboContainer}>
          <Text style={styles.comboText}>🔥 {stats.comboCount}x Combo!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mainScore: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statValueInvalid: {
    color: '#F44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  comboContainer: {
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  comboText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F57C00',
  },
});

export default ScoreDisplay;
