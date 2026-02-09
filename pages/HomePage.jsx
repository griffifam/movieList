import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../atoms/SearchBar.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { Pagination } from '../molecules/Pagination.jsx';
import { SelectActionCard } from '../organisms/SelectActionCard.jsx';
import { fetchFavoriteMovies as getFavoriteMovies } from '../tmdb/fetchFavoriteMovies.jsx';
import { fetchTMDBAccountDetails } from '../tmdb/fetchTMDB.jsx';

const PAGE_SIZE = 30;

const HomePage = () => {
  const { logout } = useAuth();
  const [searchPage, setSearchPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const details = await fetchTMDBAccountDetails();
      if (!details) throw new Error('Failed to fetch user data');
      return details;
    },
  });

  const { data: favoriteList = [] } = useQuery({
    queryKey: ['favoriteList'],
    queryFn: async () => {
      const movies = await getFavoriteMovies();
      return movies.map((movie) => ({ ...movie, isFavorite: true }));
    },
  });

  const username = userData ? userData.username : 'Guest';
  const handleSearchResultsChange = useCallback((results) => {
    setSearchResults(results);
  }, []);

  const handleQueryChange = useCallback(() => {
    setSearchPage(1);
  }, []);

  const isSearching = searchResults !== null;

  const moviesToDisplay = isSearching
    ? (searchResults?.results ?? [])
    : favoriteList.slice(
        (favoritesPage - 1) * PAGE_SIZE,
        favoritesPage * PAGE_SIZE
      );

  const totalResults = isSearching
    ? (searchResults?.total_results ?? 0)
    : favoriteList.length;
  const totalPages = isSearching
    ? Math.max(1, searchResults?.total_pages ?? 1)
    : Math.max(1, Math.ceil(favoriteList.length / PAGE_SIZE));
  const currentPage = isSearching ? searchPage : favoritesPage;
  const onPageChange = isSearching ? setSearchPage : setFavoritesPage;

  const searchResultCount = searchResults?.total_results ?? 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        padding: 2,
        backgroundColor: 'transparent',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end', pr: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/profile')}>
          Profile
        </Button>
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

      <SearchBar
        searchPage={searchPage}
        onSearchResultsChange={handleSearchResultsChange}
        onQueryChange={handleQueryChange}
      />

      <Box sx={{ textAlign: 'center', mt: 5, width: '100%' }}>
        <Typography variant="h6">
          {isSearching
            ? searchResultCount > 0
              ? `Found ${searchResultCount} movies`
              : 'No movies found'
            : 'Your Favorite Movies'}
        </Typography>
        {moviesToDisplay.length > 0 ? (
          <>
            <SelectActionCard films={moviesToDisplay} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={onPageChange}
              pageSize={isSearching ? 20 : PAGE_SIZE}
            />
          </>
        ) : (
          <Typography variant="body1">
            {isSearching ? 'Try a different search term' : 'No favorite movies found.'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
