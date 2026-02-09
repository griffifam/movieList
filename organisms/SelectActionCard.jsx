import { Box } from '@mui/material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import { FilmCard } from '../organisms/FilmCard.jsx';
import addRemoveFavorite from "../tmdb/addRemoveFavorite.jsx";

export const SelectActionCard = ({ films }) => {
  const queryClient = useQueryClient();
  const hasFavorites = films.some((film) => film.isFavorite);
  const initialFavorites = hasFavorites
    ? films.filter((film) => film.isFavorite).map((film) => film.id)
    : [];
  const [favoriteFilmIds, setFavoriteFilmIds] = useState(initialFavorites);
  const [favoriteMovies, setFavoriteMovies] = useState(films);

  useEffect(() => {
    setFavoriteMovies(films);
    const newFavorites = films.filter((film) => film.isFavorite).map((film) => film.id);
    setFavoriteFilmIds(newFavorites);
  }, [films]);
  
  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: ({ filmId, favorite }) => addRemoveFavorite(filmId, favorite),

    onMutate: async ({ filmId, favorite }) => {
      setFavoriteMovies((curr) =>
        curr.map((m) =>
          m.id === filmId ? { ...m, isFavorite: favorite } : m
        )
      );
      return { prev: favoriteMovies };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteList'] });
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) setFavoriteMovies(ctx.prev);
    },
  });

  const handleFavorite = useCallback(
    (filmId) => {
      const current =
        favoriteMovies.find((f) => f.id === filmId)?.isFavorite ?? false;
      toggleFavorite({ filmId, favorite: !current });
    },
    [favoriteMovies, toggleFavorite]
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 1,
      }}
    >
      {favoriteMovies.map((film, index) => (
        <FilmCard
          key={`${film.id}-${index}`}
          film={film}
          defaultFavorite={favoriteFilmIds.includes(film.id)}
          handleFavorite={handleFavorite}
        />
      ))}
    </Box>
  );
};

SelectActionCard.propTypes = {
  films: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      release_date: PropTypes.string,
      poster_path: PropTypes.string,
      overview: PropTypes.string,
    })
  ).isRequired,
};

export default SelectActionCard;
