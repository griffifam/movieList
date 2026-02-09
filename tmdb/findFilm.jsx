const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;

export const findFilm = async (query) => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    throw new Error('No session_id found in localStorage');
  }

  const url = `${baseUrl}search/movie?query=${query}&include_adult=false&language=en-US&page=1`;


  try {
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
        `No film by the name: ${query}: ${errorText}.`
      );
    }

    const data = await res.json();
    return data.results || []; // return empty array if no results
  } catch (error) {
    throw new Error(
      `No film by the name: ${query}: ${error.message}.`
    );
  }
};

export default findFilm;
