
/**
 * Extract common themes and keywords from movie overviews
 * @param {Array<string>} overviews - Array of movie overview strings
 * @returns {Object} Object with theme keywords and their frequencies
 */
const extractThemes = (overviews) => {
  const themeKeywords = {
    adventure: ['journey', 'quest', 'adventure', 'expedition', 'travel', 'explore', 'discover'],
    romance: ['love', 'romance', 'relationship', 'heart', 'passion', 'affection', 'couple'],
    action: ['fight', 'battle', 'action', 'combat', 'war', 'conflict', 'hero', 'rescue'],
    mystery: ['mystery', 'secret', 'solve', 'investigate', 'clue', 'puzzle', 'hidden'],
    drama: ['drama', 'emotional', 'struggle', 'conflict', 'tragedy', 'life', 'family'],
    comedy: ['comedy', 'funny', 'humor', 'laugh', 'hilarious', 'comic', 'joke'],
    horror: ['horror', 'scary', 'frightening', 'terror', 'fear', 'haunted', 'monster'],
    sciFi: ['future', 'space', 'technology', 'scientific', 'alien', 'robot', 'cyber'],
    fantasy: ['magic', 'fantasy', 'magical', 'wizard', 'dragon', 'mythical', 'enchanted'],
    thriller: ['thriller', 'suspense', 'tension', 'danger', 'chase', 'escape', 'threat'],
  };

  const themeCounts = {};
  const lowerOverviews = overviews.map((o) => o.toLowerCase());

  Object.keys(themeKeywords).forEach((theme) => {
    themeCounts[theme] = 0;
    themeKeywords[theme].forEach((keyword) => {
      lowerOverviews.forEach((overview) => {
        if (overview.includes(keyword)) {
          themeCounts[theme]++;
        }
      });
    });
  });

  return themeCounts;
};

/**
 * Get dominant themes from overviews
 * @param {Object} themeCounts - Theme keyword counts
 * @returns {Array<string>} Top themes
 */
const getDominantThemes = (themeCounts) => {
  return Object.entries(themeCounts)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);
};

/**
 * Get personality traits based on genres
 * @param {Array} genreData - Sorted genre data from aggregateGenres
 * @returns {Object} Personality insights
 */
const getGenreInsights = (genreData) => {
  if (!genreData || genreData.length === 0) {
    return { primary: null, diversity: 'unknown' };
  }

  const topGenres = genreData.slice(0, 3).map((g) => g.name);
  const uniqueGenres = genreData.length;
  const totalFilms = genreData.reduce((sum, g) => sum + g.value, 0);
  const diversityScore = uniqueGenres / Math.max(totalFilms, 1);

  let diversity;
  if (diversityScore > 0.5) {
    diversity = 'eclectic';
  } else if (diversityScore > 0.3) {
    diversity = 'varied';
  } else {
    diversity = 'focused';
  }

  return {
    primary: topGenres[0],
    secondary: topGenres[1],
    tertiary: topGenres[2],
    diversity,
    topGenres,
  };
};

/**
 * Generate personality summary based on favorite films
 * @param {Array} movies - Array of movie objects
 * @param {Array} genreData - Aggregated genre data
 * @param {number} averageScore - Average vote_average
 * @returns {string} Generated personality summary
 */
export const generatePersonalitySummary = (movies, genreData, averageScore) => {
  if (!movies || movies.length === 0) {
    return 'No favorite films found to analyze.';
  }

  const overviews = movies
    .map((movie) => movie.overview)
    .filter((overview) => overview && overview.trim().length > 0);

  if (overviews.length === 0) {
    return 'Your favorite films do not have overviews available for analysis.';
  }

  // Extract insights
  const themeCounts = extractThemes(overviews);
  const dominantThemes = getDominantThemes(themeCounts);
  const genreInsights = getGenreInsights(genreData);

  // Build summary sentences
  const sentences = [];

  // Opening based on diversity
  if (genreInsights.diversity === 'eclectic') {
    sentences.push(
      `Your film taste is wonderfully eclectic, spanning ${genreData.length} different genres and showing a genuine appreciation for cinematic diversity.`
    );
  } else if (genreInsights.diversity === 'varied') {
    sentences.push(
      `You have a varied taste in cinema, exploring ${genreData.length} different genres while maintaining clear preferences.`
    );
  } else if (genreInsights.diversity === 'focused') {
    const topTwoGenres = genreInsights.topGenres && genreInsights.topGenres.length >= 2
      ? genreInsights.topGenres.slice(0, 2).join(' and ')
      : genreInsights.primary || 'your favorite genres';
    sentences.push(
      `You have a focused and passionate interest in ${genreInsights.primary || 'cinema'}, with ${topTwoGenres} dominating your collection.`
    );
  } else {
    // Unknown diversity - fallback
    sentences.push(
      'Your film collection shows a unique and personal approach to cinema.'
    );
  }

  // Genre-specific insights
  if (genreInsights.primary) {
    const genreDescriptions = {
      Action: 'You crave adrenaline-pumping excitement and high-stakes narratives.',
      Abenteuer: 'You love epic journeys and stories of exploration and discovery.',
      Animation: 'You appreciate the artistry and creativity of animated storytelling.',
      Komödie: 'You value humor and lighthearted entertainment that brings joy.',
      Krimi: 'You enjoy complex narratives centered around crime and justice.',
      Dokumentarfilm: 'You seek real-world stories and factual content that educates.',
      Drama: 'You\'re drawn to emotionally rich narratives that explore human experiences.',
      Familie: 'You appreciate wholesome entertainment suitable for all ages.',
      Fantasy: 'You love escaping into magical worlds and extraordinary adventures.',
      Historie: 'You\'re fascinated by stories rooted in real historical events.',
      Horror: 'You enjoy the thrill and suspense of frightening tales.',
      Musik: 'You\'re passionate about films that celebrate music and musicians.',
      Mystery: 'You love puzzling stories with secrets waiting to be uncovered.',
      Liebesfilm: 'You\'re a romantic at heart, drawn to stories of love and connection.',
      'Science Fiction': 'You\'re fascinated by futuristic possibilities and scientific exploration.',
      'TV-Film': 'You appreciate accessible storytelling made for television.',
      Thriller: 'You crave suspenseful narratives that keep you on edge.',
      Kriegsfilm: 'You\'re interested in stories of conflict and its consequences.',
      Western: 'You enjoy classic tales of the American frontier.',
    };

    const desc = genreDescriptions[genreInsights.primary] || `You have a strong preference for ${genreInsights.primary} films.`;
    sentences.push(desc);
  }

  // Theme analysis
  if (dominantThemes.length > 0) {
    const themeDescriptions = {
      adventure: 'Your films often feature journeys of discovery and exploration.',
      romance: 'You\'re drawn to stories of love, connection, and emotional bonds.',
      action: 'You enjoy high-energy narratives with thrilling sequences.',
      mystery: 'You love stories that challenge you to solve puzzles and uncover secrets.',
      drama: 'You appreciate emotionally complex narratives that explore human nature.',
      comedy: 'You value humor and entertainment that brings laughter and joy.',
      horror: 'You enjoy the adrenaline rush of suspenseful and frightening tales.',
      sciFi: 'You\'re fascinated by futuristic concepts and technological possibilities.',
      fantasy: 'You love escaping into worlds of magic and wonder.',
      thriller: 'You crave tension and suspense that keeps you engaged.',
    };

    const primaryTheme = dominantThemes[0];
    if (themeDescriptions[primaryTheme]) {
      sentences.push(themeDescriptions[primaryTheme]);
    }
  }

  // Rating-based insight
  if (averageScore >= 8.0) {
    sentences.push(
      'With an average rating above 8.0, you clearly have exceptional taste and gravitate toward critically acclaimed masterpieces.'
    );
  } else if (averageScore >= 7.0) {
    sentences.push(
      'Your preference for well-regarded films (averaging above 7.0) shows you value quality storytelling and cinematic excellence.'
    );
  } else if (averageScore >= 6.0) {
    sentences.push(
      'You appreciate a wide range of films, from mainstream hits to more niche selections, showing an open-minded approach to cinema.'
    );
  } else {
    sentences.push(
      'You have a unique taste that embraces underrated gems and cult classics, showing you value films beyond mainstream popularity.'
    );
  }

  // Closing statement
  if (movies.length >= 10) {
    sentences.push(
      `With ${movies.length} favorite films, your collection reveals a well-developed and thoughtful approach to cinema.`
    );
  } else {
    sentences.push(
      `Your growing collection of ${movies.length} favorite film${movies.length !== 1 ? 's' : ''} is just the beginning of your cinematic journey.`
    );
  }

  return sentences.join(' ');
};

export default generatePersonalitySummary;
