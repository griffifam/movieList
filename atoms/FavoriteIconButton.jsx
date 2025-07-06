import { Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

export const FavoriteIconButton = ({
  id,
  isFavorite,
  handleAddFavorite,
  handleRemoveFavorite,
}) => {
  const { control } = useForm();

  const handleClick = () => {
    if (isFavorite) {
      handleRemoveFavorite(id);
    } else {
      handleAddFavorite(id);
    }
  };

  const {
    field,
    fieldState: { isTouched, isDirty },
  } = useController({
    name: `favoriteItem_${id}`,
    control,
    rules: {},
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          '&:hover': { backgroundColor: '#f8d7da' },
        }}
        size="x-small"
      >
        <FavoriteIcon sx={{ color: isFavorite ? 'red' : 'grey.400' }} />
      </IconButton>
    </Box>
  );
};

export default FavoriteIconButton;

FavoriteIconButton.propTypes = {
  id: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  handleAddFavorite: PropTypes.func.isRequired,
  handleRemoveFavorite: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
};
