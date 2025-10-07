import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { SelectActionCard } from '../organisms/SelectActionCard.jsx';
import { queryClient } from '../src/main.jsx';
import { fetchFavoriteMovies as getFavoriteMovies } from '../tmdb/fetchFavoriteMovies.jsx';
import { fetchTMDBAccountDetails } from '../tmdb/fetchTMDB.jsx';

const HomePage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery(
    {
      queryKey: ['userData'],
      queryFn: async () => {
        const details = await fetchTMDBAccountDetails();
        if (!details) {
          throw new Error('Failed to fetch user data');
        }
        console.log('User Details:', details);
        setUser(details);
        return details;
      },
    },
    queryClient
  );

  const { data, isLoading, error } = useQuery(
    {
      queryKey: ['favoriteList'],
      queryFn: async () => {
        const movies = await getFavoriteMovies();
        const moviesWithFavoriteFlag = movies.map((movie) => ({
          ...movie,
          isFavorite: true,
        }));
        setFavoriteMovies(moviesWithFavoriteFlag);
        return moviesWithFavoriteFlag;
      },
    },
    queryClient
  );

  const username = userData ? userData.username : 'Guest';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        padding: 2,
        backgroundColor: 'transparent', // Or 'background.default' if themed
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{}}>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4">Welcome, {username} 🎉</Typography>
        {userData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your TMDB Account ID: {userData.id}
            </Typography>
            <Typography variant="body1">
              Username: {userData.username}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 5, width: '100%' }}>
        <Typography variant="h6">Your Favorite Movies</Typography>
        {favoriteMovies && favoriteMovies.length > 0 ? (
          <SelectActionCard films={favoriteMovies} />
        ) : (
          <Typography variant="body1">No favorite movies found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
