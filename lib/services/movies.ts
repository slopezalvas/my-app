export async function searchMovies(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-ES`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        accept: 'application/json',
      },
    }
  );
  const data = await res.json();

  return data.results?.slice(0, 3).map((m: any) => ({
    titulo: m.title,
    resumen: m.overview,
    fecha: m.release_date,
    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`
  }));
}