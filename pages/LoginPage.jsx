import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import AuthorizationForm from '../organisms/forms/AuthorizationForm.jsx';
import { createRequestToken } from '../tmdb/createRequestToken.jsx';
import HomePage from './HomePage.jsx';

const LoginPage = () => {
  const { login, logout, userData } = useAuth();
  const navigate = useNavigate();
  const correctUsername = 'movie';
  const correctPassword = 'pass';
  const [authorized, setAuthorized] = useState(false);

  const handleLogin = (user) => {
    createRequestToken();
    login(user);
  };

  // Get handleSubmit and control from useForm
  const { handleSubmit, control } = useForm();

  // React Hook Form passes `data` to onSubmit
  const onSubmit = ({ username, password }) => {
    if (username === correctUsername && password === correctPassword) {
      setAuthorized(true);
      handleLogin(username);
      // make API call to fetch userData from TMDB
      // For now, we will just simulate it
      const user = { username: correctUsername, password: correctPassword };
      login(user);
      navigate('/home');
    } else {
      alert('Incorrect username or password');
    }
  };

  return authorized ? (
    <HomePage />
  ) : (
    <AuthorizationForm
      control={control}
      handleSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default LoginPage;
