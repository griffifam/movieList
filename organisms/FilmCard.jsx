import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { useState } from 'react';

export const FilmCard = ({
  film,
  defaultFavorite = false,
  handleFavorite
}) => {
  const [isFavorite, setIsFavorite] = useState(defaultFavorite);

  const toggleFavorite = () => {
    handleFavorite(film.id, false);
    setIsFavorite((prev) => !prev);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.split('-')[0];
  };

  const year = formatDate(film.release_date);

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "all 0.3s ease-in-out",
        "&:hover, &:focus-within": {
          backgroundColor: "rgba(227, 212, 212, 0.9)",
          boxShadow: "0 8px 20px rgba(255, 0, 0, 0.4), 0 0 10px rgba(255, 0, 0, 0.3)",
          zIndex: 2,
          transform: "scale(1.02)",
          border: "1px solid rgba(246, 15, 15, 0.9)",
        },
        position: "relative",
        maxWidth: 275,
        border: "1px solid black",
        borderRadius: "8px",
        aspectRatio: "2/3",
        overflow: "hidden",
      }}
    >
      <IconButton
        aria-label="toggle favorite"
        onClick={toggleFavorite}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
        }}
      >
        {isFavorite ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteIcon color='disabled' />
        )}
      </IconButton>
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
        alt={film.title}
        title={film.title}
      />
      <CardContent sx={{ p: 1 }}>
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {film.title}
        </Box>
        <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
          {year}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilmCard;
