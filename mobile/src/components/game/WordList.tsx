/**
 * WordList Component
 * Displays list of submitted words with scores
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { WordEntry } from '../../store';

interface WordListProps {
  words: WordEntry[];
}

interface WordItemProps {
  entry: WordEntry;
  index: number;
}

const WordItem: React.FC<WordItemProps> = ({ entry, index }) => {
  return (
    <View
      style={[
        styles.wordItem,
        entry.isValid ? styles.wordItemValid : styles.wordItemInvalid,
      ]}
    >
      <View style={styles.wordItemLeft}>
        <Text style={styles.wordIndex}>#{index + 1}</Text>
        <Text
          style={[
            styles.wordText,
            !entry.isValid && styles.wordTextInvalid,
          ]}
        >
          {entry.word}
        </Text>
      </View>
      <View style={styles.wordItemRight}>
        {entry.isValid ? (
          <>
            <Text style={styles.scoreText}>+{entry.score}</Text>
            {entry.scoreBreakdown &&
              entry.scoreBreakdown.bonusReasons.length > 0 && (
                <Text style={styles.bonusText}>
                  {entry.scoreBreakdown.bonusReasons[0]}
                </Text>
              )}
          </>
        ) : (
          <Text style={styles.errorText}>{entry.reason || 'Invalid'}</Text>
        )}
      </View>
    </View>
  );
};

export const WordList: React.FC<WordListProps> = ({ words }) => {
  if (words.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No words submitted yet</Text>
        <Text style={styles.emptySubtext}>Start typing to play!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[...words].reverse()} // Show newest first
      keyExtractor={(item, index) => `${item.word}-${item.timestamp}-${index}`}
      renderItem={({ item, index }) => (
        <WordItem entry={item} index={words.length - 1 - index} />
      )}
      contentContainerStyle={styles.listContent}
      style={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  wordItemValid: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  wordItemInvalid: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  wordItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wordIndex: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginRight: 8,
    width: 32,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  wordTextInvalid: {
    color: '#C62828',
    textDecorationLine: 'line-through',
  },
  wordItemRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  bonusText: {
    fontSize: 10,
    color: '#1B5E20',
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default WordList;
