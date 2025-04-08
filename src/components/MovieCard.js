import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
          <Text style={styles.director}>{movie.director}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  director: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 2,
  },
  year: {
    fontSize: 14,
    color: '#888',
  },
});

export default MovieCard;