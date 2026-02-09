import { getGenreNameById } from '../server/src/services/genres.js';

/**
 * Aggregate genre counts from an array of movies
 * Handles multiple genre_ids per film
 * @param {Array} movies - Array of movie objects with genre_ids property
 * @returns {Array} Array of objects with { name, value, id } for pie chart
 */
export const aggregateGenres = (movies) => {
  if (!movies || movies.length === 0) {
    return [];
  }

  const genreCounts = {};

  // Count occurrences of each genre across all films
  movies.forEach((movie) => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      movie.genre_ids.forEach((genreId) => {
        const genreName = getGenreNameById(genreId);
        if (genreName) {
          genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
        }
      });
    }
  });

  // Convert to array format for pie chart
  const genreData = Object.entries(genreCounts).map(([id, count]) => ({
    id: parseInt(id, 10),
    name: getGenreNameById(parseInt(id, 10)),
    value: count,
  }));

  // Sort by count descending
  return genreData.sort((a, b) => b.value - a.value);
};

/**
 * Calculate average vote_average from movies
 * @param {Array} movies - Array of movie objects with vote_average property
 * @returns {number} Average score formatted to 2 decimal places
 */
export const calculateAverageScore = (movies) => {
  if (!movies || movies.length === 0) {
    return 0.0;
  }

  const validScores = movies
    .map((movie) => movie.vote_average)
    .filter((score) => typeof score === 'number' && !isNaN(score));

  if (validScores.length === 0) {
    return 0.0;
  }

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  const average = sum / validScores.length;

  // Round to 2 decimal places
  return Math.round(average * 100) / 100;
};

/**
 * Get descriptive text based on average score
 * @param {number} score - Average vote_average score
 * @returns {string} Description of what the score means
 */
export const getScoreDescription = (score) => {
  if (score >= 0 && score < 4.0) {
    return 'You have a unique taste in niche and experimental films';
  } else if (score >= 4.0 && score <= 5.0) {
    return 'You enjoy cult classics and underrated gems';
  } else if (score > 5.0 && score <= 6.5) {
    return 'You appreciate diverse films across the spectrum';
  } else if (score > 6.5 && score <= 7.5) {
    return 'You prefer well-regarded and critically acclaimed films';
  } else if (score > 7.5 && score <= 8.5) {
    return 'You love popular and award-winning cinema';
  } else if (score > 8.5 && score <= 10.0) {
    return 'You have exceptional taste in acclaimed masterpieces';
  } else {
    return 'Your film preferences are ... rather unique';
  }
};
