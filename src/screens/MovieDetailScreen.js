import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, Animated, Dimensions } from 'react-native';
import { fetchMovieDetails } from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const MovieDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value((Dimensions.get('window').width)/2)); // 🆕

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      const data = await fetchMovieDetails(id);
      setMovie(data);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !movie) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMovieDetails} />;
  }

  if (!movie) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]  // 🆕 slide up effect
      }}>
        <View style={styles.posterContainer}>
          <Image 
            source={{ uri: movie.poster || 'https://via.placeholder.com/300x450' }} 
            style={styles.poster}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>Year: {movie.year}</Text>
            <Text style={styles.metaText}>Rating: {movie.rating}/10</Text>
          </View>
          
          <Text style={styles.label}>Director:</Text>
          <Text style={styles.text}>{movie.director}</Text>
          
          <Text style={styles.label}>Cast:</Text>
          <Text style={styles.text}>{movie.cast?.join(', ')}</Text>
          
          <Text style={styles.label}>Plot:</Text>
          <Text style={styles.text}>{movie.plot}</Text>
          
          <Text style={styles.label}>Genre:</Text>
          <Text style={styles.text}>{movie.genre?.join(', ')}</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    posterContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: '#1a1a1a',
    },
    poster: {
      width: 300,
      height: 450,
      borderRadius: 8,
    },
    detailsContainer: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
    metaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    metaText: {
      fontSize: 16,
      color: '#bbb',
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginTop: 15,
      marginBottom: 5,
    },
    text: {
      fontSize: 16,
      color: '#ddd',
      lineHeight: 24,
    },
  });
  
  export default MovieDetailScreen;
