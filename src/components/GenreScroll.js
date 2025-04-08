import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { GENRES } from '../utils/constants';

const GenreScroll = ({ onGenreSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenrePress = (genre) => {
    const newGenre = selectedGenre?.id === genre.id ? null : genre;
    setSelectedGenre(newGenre);
    onGenreSelect(newGenre?.id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={GENRES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.genreButton,
              selectedGenre?.id === item.id && styles.selectedGenreButton,
            ]}
            onPress={() => handleGenrePress(item)}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenre?.id === item.id && styles.selectedGenreText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    bottom:5,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: 0,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  selectedGenreButton: {
    backgroundColor: '#ff4757',
  },
  genreText: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedGenreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GenreScroll;