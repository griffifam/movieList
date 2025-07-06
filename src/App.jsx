import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import AuthCallback from '../auth/AuthCallback.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';

function App() {
  return (
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
  );
}

export default App;
