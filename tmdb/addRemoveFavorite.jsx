const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

export const addRemoveFavorite = async (filmId, newFavStatus) => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    throw new Error('No session_id found in localStorage');
  }

  const url = `${baseUrl}account/${accountId}/favorite?session_id=${sessionId}`;

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
      `Failed to ${newFavStatus ? 'add' : 'remove'} favorite: ${res.status} ${errorText}`
    );
  }

  const data = await res.json();
  console.log(data, "data");
  // POST /account/{account_id}/favorite returns { success: boolean, status_code: number, status_message: string }
  return data;
};

export default addRemoveFavorite;
