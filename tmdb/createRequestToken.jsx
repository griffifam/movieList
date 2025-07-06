const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

export const createRequestToken = async () => {
  console.log(apiKey, baseUrl, accountId);
  const url = `${baseUrl}authentication/token/new`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create session: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error('Failed to create session: ' + data.status_message);
  }

  if (data.success) {
    console.log('Session created successfully:', data);

    const token = data.request_token;

    const redirectUrl = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:5173/auth/callback`;

    localStorage.setItem('request_token', token);

    console.log('Redirecting to TMDB authentication page:', redirectUrl);

    window.location.href = redirectUrl;
  }
};

export default createRequestToken;
