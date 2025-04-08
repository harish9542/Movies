import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import GenreScroll from '../components/GenreScroll';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const cardAnimations = useRef([]).current;

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterMovies();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedGenre, movies]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await fetchMovies();
      setMovies(data);
      setFilteredMovies(data);

      cardAnimations.length = 0;
      data.forEach((_, index) => {
        cardAnimations[index] = new Animated.Value(0);
      });

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
        Animated.stagger(
          100,
          data.map((_, index) =>
            Animated.spring(cardAnimations[index], {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let result = [...movies];

    if (selectedGenre) {
      result = result.filter(movie => {
        if (!movie.genre || !Array.isArray(movie.genre)) return false;
        return movie.genre.some(
          g => g.toString().toLowerCase() === selectedGenre.toLowerCase()
        );
      });
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        movie =>
          movie.title.toLowerCase().includes(query) ||
          (movie.director && movie.director.toLowerCase().includes(query))
      );
    }

    cardAnimations.length = 0;
    result.forEach((_, index) => {
      cardAnimations[index] = new Animated.Value(0);
    });

    setFilteredMovies(result);

    Animated.stagger(
      100,
      result.map((_, index) =>
        Animated.spring(cardAnimations[index], {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const handleGenreSelect = genreId => {
    setSelectedGenre(genreId);
  };

  const renderItem = ({ item, index }) => {
    const cardAnim = cardAnimations[index] || new Animated.Value(0);
    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [{ translateY: slideUpAnim }, { scale: cardAnim }],
        }}
      >
        <MovieCard
          movie={item}
          onPress={() =>
            navigation.navigate('MovieDetail', {
              id: item.id,
              sharedElement: `moviePoster${item.id}`,
            })
          }
        />
      </Animated.View>
    );
  };

  if (loading && movies.length === 0) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMovies} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          {  backgroundColor: '#121212' },
        ]}
      >
        <Animated.View
          style={[
            styles.searchContainer,
            {
              transform: [{ translateY: slideUpAnim }],
              backgroundColor: '#1e1e1e',
            },
          ]}
        >
          <Image
            source={require('../assets/images/search.png')}
            style={{
              width: 24,
              height: 24,
              tintColor: 'gray',
              marginRight: 10,
            }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        <GenreScroll onGenreSelect={handleGenreSelect} />

        <FlatList
          data={filteredMovies.slice(0, 20)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ErrorMessage message="No movies found. Try a different search or genre." />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    bottom: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
});

export default HomeScreen;
