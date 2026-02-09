const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const searchMovies = async (query, page = 1) => {
  const params = new URLSearchParams({ q: query, page });
  const res = await fetch(`${API_BASE}/api/movies/search?${params}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Search failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    results: data.results ?? [],
    page: data.page ?? 1,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
};

export const getMovieById = async (id) => {
  const res = await fetch(`${API_BASE}/api/movies/${id}`);

  if (!res.ok) {
    if (res.status === 404) throw new Error('Movie not found');
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch movie: ${res.status}`);
  }

  return res.json();
};
