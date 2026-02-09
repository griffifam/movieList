import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FilmCard = ({
  film,
  defaultFavorite = false,
  handleFavorite
}) => {
  const [isFavorite, setIsFavorite] = useState(defaultFavorite);
  const navigate = useNavigate();

  // Sync local state with prop changes
  useEffect(() => {
    setIsFavorite(defaultFavorite);
  }, [defaultFavorite]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    handleFavorite(film.id);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.split('-')[0];
  };

  const year = formatDate(film.release_date);

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/film/${film.id}`)}
      sx={{
        transition: "all 0.3s ease-in-out",
        "&:hover, &:focus-within": {
          backgroundColor: "rgba(18, 1, 1, 0.9)",
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
        cursor: "pointer",
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
