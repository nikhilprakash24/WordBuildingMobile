/**
 * GameScreen
 * Main game screen for single-player word building
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useGameStore } from '../store';
import { WordInput, WordList, ScoreDisplay } from '../components/game';
import { getAvailableCategories } from '../services/dictionary';

export const GameScreen: React.FC = () => {
  const {
    isPlaying,
    submittedWords,
    stats,
    config,
    startGame,
    endGame,
    submitWord,
    resetGame,
  } = useGameStore();

  const handleStartGame = () => {
    startGame(config.category);
  };

  const handleEndGame = () => {
    Alert.alert(
      'End Game?',
      'Are you sure you want to end the current game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: () => {
            endGame();
            showGameSummary();
          },
        },
      ]
    );
  };

  const showGameSummary = () => {
    setTimeout(() => {
      Alert.alert(
        'Game Over!',
        `Final Score: ${stats.totalScore}\n` +
          `Valid Words: ${stats.validWords}\n` +
          `Invalid Words: ${stats.invalidWords}\n` +
          `Average Score: ${stats.averageScore}\n` +
          `Longest Word: ${stats.longestWord || 'N/A'}`,
        [
          {
            text: 'Play Again',
            onPress: () => {
              resetGame();
              handleStartGame();
            },
          },
          { text: 'OK', onPress: resetGame },
        ]
      );
    }, 500);
  };

  if (!isPlaying) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.menuContainer}>
          <Text style={styles.title}>CXI Word Game</Text>
          <Text style={styles.subtitle}>Build words, earn points!</Text>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryChips}>
              {getAvailableCategories().map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    config.category === category && styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    useGameStore.setState(state => ({
                      config: { ...state.config, category },
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      config.category === category &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>

          {stats.totalScore > 0 && (
            <View style={styles.lastGameContainer}>
              <Text style={styles.lastGameTitle}>Last Game</Text>
              <Text style={styles.lastGameScore}>
                Score: {stats.totalScore} ({stats.validWords} words)
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {config.category.charAt(0).toUpperCase() + config.category.slice(1)}
        </Text>
        <TouchableOpacity style={styles.endButton} onPress={handleEndGame}>
          <Text style={styles.endButtonText}>End Game</Text>
        </TouchableOpacity>
      </View>

      {/* Score Display */}
      <ScoreDisplay stats={stats} />

      {/* Word List */}
      <WordList words={submittedWords} />

      {/* Word Input */}
      <WordInput onSubmit={submitWord} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  endButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  categorySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  lastGameContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  lastGameTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastGameScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default GameScreen;
