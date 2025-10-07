const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

export const fetchFavoriteMovies = async () => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    throw new Error('No session_id found in localStorage');
  }

  const url = `${baseUrl}account/${accountId}/favorite/movies?language=en-US&sort_by=created_at.asc&session_id=${sessionId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch favorite movies: ${res.status} ${errorText}`
    );
  }

  const data = await res.json();
  return data.results;
};

export default fetchFavoriteMovies;
