import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import SelectActionCard from '../organisms/SelectActionCard.jsx';
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

  const fetchUserData = async () => {
    try {
      const data = await fetchTMDBAccountDetails();
      console.log('User Data:', data);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const favorites = await getFavoriteMovies();
      const moviesWithFavoriteFlag = favorites.map((movie) => ({
        ...movie,
        isFavorite: true,
      }));

      setFavoriteMovies(moviesWithFavoriteFlag);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchFavoriteMovies();
  }, []);

  const username = user ? user.username : 'Guest';

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="body2" textAlign="right"></Typography>
        <Typography variant="h4">Welcome, {username} 🎉</Typography>
        {user && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your TMDB Account ID: {user.id}
            </Typography>
            <Typography variant="body1">Username: {user.username}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">Your Favorite Movies</Typography>
        {favoriteMovies && favoriteMovies.length > 0 ? (
          <SelectActionCard films={favoriteMovies} />
        ) : (
          <Typography variant="body1">No favorite movies found.</Typography>
        )}
      </Box>
    </>
  );
};

export default HomePage;
