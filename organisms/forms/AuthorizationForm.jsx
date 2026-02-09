import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import InputField from '../../molecules/fields/InputField.jsx';

const wrapperStyles = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Roboto, sans-serif',
};

const formStyles = {
  width: 360,
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const AuthorizationForm = ({ control, handleSubmit }) => {
  return (
    <Box sx={wrapperStyles}>
      <form onSubmit={handleSubmit}>
        <Box sx={formStyles}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              letterSpacing: '0.5px',
              color: 'text.primary',
              textAlign: 'center',
              borderBottom: '2px solid #e50914',
              display: 'inline-block',
            }}
          >
            🎬 Movie Artiste Sign In
          </Typography>

          <InputField
            name="username"
            type="text"
            icon={<PersonIcon />}
            control={control}
            label="Username"
          />

          <InputField
            name="password"
            type="password"
            control={control}
            label="Password"
          />

          <Typography variant="body2" textAlign="right">
            <a
              href="https://www.google.com"
              style={{ color: '#1a73e8', textDecoration: 'none' }}
            >
              Forgot Password?
            </a>
          </Typography>

          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              pt: 1,
            }}
          >
            <Button
              type="submit"
              sx={{
                width: '200px',
                backgroundColor: 'black',
                color: 'red',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'red',
                  color: 'black',
                  boxShadow: '0 0 12px rgba(199, 8, 8, 0.6)',
                  border: '1px solid red',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

AuthorizationForm.propTypes = {
  control: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AuthorizationForm;
