const baseUrl = import.meta.env.VITE_TMDB_API_URL;
const apiToken = import.meta.env.VITE_TMDB_API_TOKEN;
const accountId = import.meta.env.VITE_TMDB_API_ACCOUNT_ID;

const fetchFavoriteMoviesPage = async (page = 1) => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    throw new Error('No session_id found in localStorage');
  }

  const url = `${baseUrl}account/${accountId}/favorite/movies?language=en-US&sort_by=created_at.asc&session_id=${sessionId}&page=${page}`;

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
  return {
    results: data.results ?? [],
    page: data.page ?? 1,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
};

/** Fetches all pages of favorites and returns the full list */
export const fetchFavoriteMovies = async () => {
  const first = await fetchFavoriteMoviesPage(1);
  const all = [...first.results];
  for (let p = 2; p <= first.total_pages; p++) {
    const next = await fetchFavoriteMoviesPage(p);
    all.push(...next.results);
  }
  return all;
};

export default fetchFavoriteMovies;
