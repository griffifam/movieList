import { Box, Button, CircularProgress, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { fetchFavoriteMovies as getFavoriteMovies } from '../tmdb/fetchFavoriteMovies.jsx';
import {
  aggregateGenres,
  calculateAverageScore,
  getScoreDescription,
} from '../utils/calculateFilmStats.jsx';
import { generatePersonalitySummary } from '../utils/generatePersonalitySummary.jsx';

// Color palette for pie chart
const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52BE80',
  '#EC7063',
  '#5DADE2',
  '#F1948A',
  '#7FB3D3',
  '#85C1E9',
  '#AED6F1',
  '#A9DFBF',
  '#F9E79F',
];

// Genre descriptions
const getGenreDescription = (genreName) => {
  const descriptions = {
    'Action': 'High-energy films with thrilling stunts, combat, and fast-paced sequences.',
    'Abenteuer': 'Epic journeys and exciting quests that take you to new worlds and experiences.',
    'Animation': 'Artistic storytelling through animated visuals, from classic to modern styles.',
    'Komödie': 'Lighthearted entertainment designed to make you laugh and feel good.',
    'Krimi': 'Stories centered around crime, investigation, and the pursuit of justice.',
    'Dokumentarfilm': 'Real-world stories and factual content that educates and informs.',
    'Drama': 'Emotionally rich narratives exploring human relationships and life experiences.',
    'Familie': 'Wholesome entertainment suitable for viewers of all ages.',
    'Fantasy': 'Magical worlds, mythical creatures, and extraordinary adventures.',
    'Historie': 'Stories based on real historical events and periods.',
    'Horror': 'Suspenseful and frightening tales designed to thrill and scare.',
    'Musik': 'Films centered around music, musicians, and musical performances.',
    'Mystery': 'Puzzling stories with secrets to uncover and mysteries to solve.',
    'Liebesfilm': 'Romantic stories about love, relationships, and emotional connections.',
    'Science Fiction': 'Futuristic stories exploring technology, space, and scientific possibilities.',
    'TV-Film': 'Made-for-television movies with accessible storytelling.',
    'Thriller': 'Suspenseful narratives that keep you on the edge of your seat.',
    'Kriegsfilm': 'Stories set during wartime, exploring conflict and its consequences.',
    'Western': 'Classic tales of the American frontier and cowboy adventures.',
  };
  return descriptions[genreName] || 'A diverse genre with unique storytelling elements.';
};

// Custom tooltip for pie chart - ensures light, readable text
const CustomChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percentage } = payload[0].payload;
  const filmText = `${value} film${value !== 1 ? 's' : ''}`;
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 1,
        padding: 1.5,
        minWidth: 140,
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
        {filmText} {percentage && `(${percentage})`}
      </Typography>
    </Box>
  );
};

// Custom legend grid with hover sync
const CustomLegendGrid = ({ payload, activeIndex, onItemHover }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 1,
      padding: 2,
      color: 'white',
    }}
  >
    {payload.map((entry, index) => {
      const isActive = activeIndex === index;
      return (
        <Box
          key={entry.payload?.name ?? entry.value ?? index}
          onMouseEnter={() => onItemHover(index)}
          onMouseLeave={() => onItemHover(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '4px 8px',
            borderRadius: 1,
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '2px',
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Typography component="span" variant="body2" sx={{ color: 'white' }}>
              {entry.payload?.name ?? entry.value}
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', ml: 0.5 }}>
              {entry.payload?.percentage ?? ''}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  // Fetch favorite movies
  const { data: favoriteMovies = [], isLoading: isLoadingMovies } = useQuery({
    queryKey: ['favoriteList'],
    queryFn: async () => {
      const movies = await getFavoriteMovies();
      return movies.map((movie) => ({
        ...movie,
        isFavorite: true,
      }));
    },
  });

  // Calculate statistics
  const genreData = aggregateGenres(favoriteMovies || []);
  const top5Genres = genreData.slice(0, 5);
  const averageScore = calculateAverageScore(favoriteMovies || []);
  const scoreDescription = getScoreDescription(averageScore);

  // Generate personality summary (client-side, no API needed)
  const personalitySummary = favoriteMovies && favoriteMovies.length > 0
    ? generatePersonalitySummary(favoriteMovies, genreData, averageScore)
    : null;

  // Format genre data for pie chart with percentages
  const chartData = genreData.map((genre) => {
    const total = genreData.reduce((sum, g) => sum + g.value, 0);
    const percentage = total > 0 ? ((genre.value / total) * 100).toFixed(1) : 0;
    return {
      ...genre,
      percentage: `${percentage}%`,
    };
  });

  if (isLoadingMovies) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        padding: 4,
        backgroundColor: 'transparent',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end', pr: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Home
        </Button>
      </Box>
      <Typography variant="h3" sx={{ mb: 2, textAlign: 'center' }}>
        Your Film Profile
      </Typography>

      {/* Personality Summary Section */}
      <Paper
        sx={{
          padding: 3,
          maxWidth: 900,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          Summary
        </Typography>
        {personalitySummary ? (
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.95)' }}>
            {personalitySummary}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            No favorite films found to analyze.
          </Typography>
        )}
      </Paper>

      {/* Genre Distribution Pie Chart */}
      <Paper
        sx={{
          padding: 3,
          maxWidth: 900,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
          Genre Distribution
        </Typography>
        {genreData.length > 0 ? (
          <Box sx={{ width: '100%', height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  label={false}
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  shape={(props) => {
                    const idx = chartData.findIndex(
                      (d) => d.name === props.payload?.name && d.value === props.payload?.value
                    );
                    const isActive = idx >= 0 && activeIndex === idx;
                    return (
                      <Sector
                        {...props}
                        fillOpacity={isActive ? 1 : 0.7}
                        strokeWidth={isActive ? 2 : 0}
                        stroke={isActive ? 'rgba(255, 255, 255, 0.8)' : undefined}
                      />
                    );
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  content={(props) => (
                    <CustomLegendGrid
                      payload={props.payload}
                      activeIndex={activeIndex}
                      onItemHover={setActiveIndex}
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
            No genre data available from your favorite films.
          </Typography>
        )}
      </Paper>

      {/* Top 5 Most Popular Genres */}
      <Paper
        sx={{
          padding: 3,
          maxWidth: 900,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
          Top 5 Most Popular Genres
        </Typography>
        {top5Genres.length > 0 ? (
          <List>
            {top5Genres.map((genre, index) => (
              <ListItem
                key={genre.id}
                sx={{
                  backgroundColor: COLORS[index % COLORS.length],
                  borderRadius: 1,
                  mb: 1,
                  padding: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontWeight: 'bold',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {index + 1}
                </Box>
                <ListItemText
                  primary={genre.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: 'block', mb: 0.5, color: 'rgba(255, 255, 255, 0.9)' }}
                      >
                        {getGenreDescription(genre.name)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}
                      >
                        Appears in {genre.value} film{genre.value !== 1 ? 's' : ''}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    variant: 'h6',
                    fontWeight: 'bold',
                    sx: { color: 'white' },
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
            No genre data available from your favorite films.
          </Typography>
        )}
      </Paper>

      {/* Average Score Section */}
      <Paper
        sx={{
          padding: 3,
          maxWidth: 900,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          Average Film Rating
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#4ECDC4',
          }}
        >
          {averageScore.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>
          {scoreDescription}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
