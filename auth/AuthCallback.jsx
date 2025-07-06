import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestToken = new URLSearchParams(window.location.search).get(
      'request_token'
    );

    const createSession = async () => {
      try {
        const res = await fetch(
          `${baseUrl}authentication/session/new?api_key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request_token: requestToken }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error('Failed to create session:', data);
          return;
        }

        localStorage.setItem('session_id', data.session_id);

        navigate('/home');

        window.history.replaceState({}, document.title, '/home');
      } catch (err) {
        console.error('Error creating session:', err);
      }
    };

    if (requestToken) {
      createSession();
    } else {
      console.error('No request token found in URL');
    }
  }, [navigate]);

  return <p>Authenticating with TMDB...</p>;
};

export default AuthCallback;
