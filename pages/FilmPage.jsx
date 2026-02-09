import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieById } from '../api/movies.js';

export const FilmPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: film, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });

  if (isLoading || !id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !film) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error?.message || 'Movie not found'}</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const year = film.release_date ? film.release_date.split('-')[0] : '';
  const posterUrl = film.poster_path
    ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
    : null;
  const backdropUrl = film.backdrop_path
    ? `https://image.tmdb.org/t/p/original${film.backdrop_path}`
    : null;

  return (
    <Box sx={{ color: 'white', p: 2 }}>
      <Button sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {posterUrl && (
          <Box
            component="img"
            src={posterUrl}
            alt={film.title}
            sx={{
              width: { xs: '100%', md: 300 },
              maxWidth: 300,
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">
            {film.title}
          </Typography>
          {(year || film.vote_average != null) && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {[year, film.vote_average != null && `★ ${film.vote_average.toFixed(1)}`]
                .filter(Boolean)
                .join(' · ')}
            </Typography>
          )}
          {film.runtime != null && (
            <Typography variant="body2" color="text.secondary">
              {film.runtime} min
            </Typography>
          )}
          {film.genres?.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {film.genres.map((g) => (
                <Typography
                  key={g.id}
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  {g.name}
                </Typography>
              ))}
            </Box>
          )}
          {film.overview && (
            <Typography sx={{ mt: 2 }}>{film.overview}</Typography>
          )}
        </Box>
      </Box>

      {backdropUrl && (
        <Box
          component="img"
          src={backdropUrl}
          alt=""
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 2,
            mt: 3,
          }}
        />
      )}
    </Box>
  );
};

export default FilmPage;
