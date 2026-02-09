import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { searchMovies } from '../api/movies.js';

const PLACEHOLDER = Symbol('placeholder');

export const SearchBar = ({
  searchPage = 1,
  onSearchResultsChange,
  onQueryChange,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const prevDebouncedRef = useRef(PLACEHOLDER);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (prevDebouncedRef.current !== PLACEHOLDER && prevDebouncedRef.current !== debouncedQuery && onQueryChange) {
      onQueryChange(debouncedQuery);
    }
    prevDebouncedRef.current = debouncedQuery;
  }, [debouncedQuery, onQueryChange]);

  const { data: searchData, isLoading } = useQuery({
    queryKey: ['searchFilms', debouncedQuery, searchPage],
    queryFn: () => searchMovies(debouncedQuery, searchPage),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    if (!onSearchResultsChange) return;
    if (debouncedQuery.length < 2) {
      onSearchResultsChange(null);
      return;
    }
    if (!searchData) return;
    onSearchResultsChange({
      results: searchData.results,
      page: searchData.page,
      total_pages: searchData.total_pages,
      total_results: searchData.total_results,
    });
  }, [searchData, debouncedQuery, onSearchResultsChange]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      sx={{
        maxWidth: 700,
        mt: 2,
        mb: 2,
        backgroundColor: 'white',
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: isLoading && debouncedQuery.length >= 2 ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};

export default SearchBar;
