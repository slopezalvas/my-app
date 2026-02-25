import { z } from 'zod';

const TmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().optional().default('Sin resumen disponible'),
  release_date: z.string().optional().default('N/A'),
  poster_path: z.string().nullable(),
});

const TmdbResponseSchema = z.object({
  results: z.array(TmdbMovieSchema),
});

export type Movie = {
  titulo: string;
  resumen: string;
  fecha: string;
  poster: string | null;
};

/** Busca películas en TMDB según una consulta dada */
export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-ES`,
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
      console.error('Error de validación en TMDB:', validatedData.error);
      return [];
    }

    return validatedData.data.results.slice(0, 3).map((m) => ({
      titulo: m.title,
      resumen: m.overview,
      fecha: m.release_date,
      poster: m.poster_path 
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
        : null
    }));

  } catch (error) {
    console.error('Exception en searchMovies:', error);
    return [];
  }
}