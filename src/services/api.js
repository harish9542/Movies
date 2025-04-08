import axios from 'axios';

const API_BASE_URL = 'https://www.freetestapi.com/api/v1/movies';

export const fetchMovies = async (searchQuery = '') => {
  try {
    const url = searchQuery 
      ? `${API_BASE_URL}?search=${searchQuery}` 
      : API_BASE_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};