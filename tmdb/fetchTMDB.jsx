const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

export const fetchTMDBAccountDetails = async () => {
  const url = `${baseUrl}account/${accountId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch account details: ${res.status} ${errorText}`
    );
  }

  const data = await res.json();
  return data;
};

export default fetchTMDBAccountDetails;
