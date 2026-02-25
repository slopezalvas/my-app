import { z } from 'zod';

const TmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().optional().default('Sin resumen disponible'),
  release_date: z.string().optional().default('N/A'),
  poster_path: z.string().nullable(),
  popularity: z.number().optional().default(0), 
  vote_average: z.number().optional().default(0), 
});

const TmdbResponseSchema = z.object({
  results: z.array(TmdbMovieSchema),
});

export type Movie = {
  titulo: string;
  resumen: string;
  fecha: string;
  puntuacion: number;
  poster: string | null;
};

/** Descubre o busca películas en TMDB con filtros de calidad. */
export async function discoverMovies(params: { 
  generoId?: number; 
  año?: number; 
  query?: string 
}): Promise<Movie[]> {
  try {
    // Si hay query usamos search, si no usamos discover
    const endpoint = params.query 
      ? `search/movie?query=${encodeURIComponent(params.query)}`
      : `discover/movie?sort_by=popularity.desc&with_genres=${params.generoId || ''}&primary_release_year=${params.año || ''}`;

    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}&language=es-ES&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          accept: 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error('Error al conectar con TMDB');

    const rawData = await res.json();
    const validatedData = TmdbResponseSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.error('Error de validación:', validatedData.error);
      return [];
    }

    return validatedData.data.results
      .filter(m => m.poster_path && m.overview.length > 20)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((m) => ({
        titulo: m.title,
        resumen: m.overview,
        fecha: m.release_date,
        puntuacion: Math.round(m.vote_average * 10) / 10,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`
      }));

  } catch (error) {
    console.error('Excepción en discoverMovies:', error);
    return [];
  }
}