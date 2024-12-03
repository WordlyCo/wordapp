
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ProgressScreen = () => {
  const friends = [
    { id: '1', name: 'Alice', score: 100 },
    { id: '2', name: 'Bob', score: 90 },
    { id: '3', name: 'You', score: 85 }, // Highlight the user
    { id: '4', name: 'Charlie', score: 70 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.row, item.name === 'You' && styles.highlight]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  name: { fontSize: 18 },
  score: { fontSize: 18 },
  highlight: { backgroundColor: '#d1f7c4' }, // Light green for highlighting the user
});

export default ProgressScreen;
