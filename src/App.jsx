import Box from '@mui/material/Box';
import { Route, Routes } from 'react-router-dom';
import AuthCallback from '../auth/AuthCallback.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#121212',
        backgroundImage: 'linear-gradient(to bottom, #121212, #1e1e1e)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: 'white',
      }}
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* You can add more routes here */}
      </Routes>
    </Box>
  );
}

export default App;
