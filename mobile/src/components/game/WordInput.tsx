/**
 * WordInput Component
 * Text input for submitting words
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface WordInputProps {
  onSubmit: (word: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const WordInput: React.FC<WordInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Enter a word...',
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={disabled || !input.trim()}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  inputDisabled: {
    borderColor: '#ccc',
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    marginLeft: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WordInput;
