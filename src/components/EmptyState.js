// src/components/EmptyState.js
// Reusable component displayed when no data matches current filter/search
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ title = 'No Classes Found', message = 'No scheduled sessions match your current selection.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>☕</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginVertical: 15,
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  message: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
