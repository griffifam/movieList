import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FavoriteIconButton } from '../atoms/FavoriteIconButton.jsx';

export const SelectActionCard = ({ films }) => {
  const [selectedCard, setSelectedCard] = useState(0);
  const hasFavorites = films.some((film) => film.isFavorite);
  const initialFavorites = hasFavorites
    ? films.filter((film) => film.isFavorite).map((film) => film.id)
    : [];
  const [favoriteFilmIds, setFavoriteFilmIds] = useState(initialFavorites);

  const handleRemoveFavorite = (id) => {
    setFavoriteFilmIds((prev) => prev.filter((favId) => favId !== id));
  };

  const handleAddFavorite = (id) => {
    setFavoriteFilmIds((prev) => [...new Set([...prev, id])]);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.split('-')[0];
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
        gap: 3,
      }}
    >
      {films.map((card, index) => (
        <Tooltip
          key={card.id}
          title={`(${formatDate(card.release_date)}) ${card.overview}`}
          placement="top"
          arrow
        >
          <Card
            key={card.id}
            sx={{
              position: 'relative',
              border: '1px solid #ccc',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Optional: Add a badge or label for the selected card */}
            <FavoriteIconButton
              id={card.id}
              isFavorite={favoriteFilmIds.includes(card.id)}
              handleAddFavorite={handleAddFavorite}
              handleRemoveFavorite={handleRemoveFavorite}
            />
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? '' : undefined}
              sx={{
                height: '100%',
                '&[data-active]': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selectedHover',
                  },
                },
              }}
            >
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w200${card.poster_path}`}
                alt={card.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectPosition: 'center',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mb: 1, // spacing below image
                }}
              />
              <CardContent sx={{ p: 0, px: 1, pb: 1, flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{ fontWeight: '600' }}
                >
                  {`${card.title} (${card.release_date?.split('-')[0]})`}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Tooltip>
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
