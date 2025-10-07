const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN; // This is optional, depending on the endpoint
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

export const addRemoveFavorite = async (filmId, newFavStatus) => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    throw new Error('No session_id found in localStorage');
  }

  const url = `${baseUrl}account/${accountId}/favorite?language=en-US&sort_by=created_at.asc&session_id=${sessionId}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: filmId,
      favorite: newFavStatus,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch favorite movies: ${res.status} ${errorText}`
    );
  }

  const data = await res.json();
  console.log(data, "data");
  return data.results;
};

export default addRemoveFavorite;
