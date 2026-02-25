import { tool } from 'ai';
import { z } from 'zod';
import { savePreference } from '@/lib/services/preferences';
import { searchMovies } from '@/lib/services/movies';

export const aiTools = {
  guardarGustoUsuario: tool({
    description: 'Guarda información importante sobre gustos o preferencias del usuario.',
    parameters: z.object({
      categoria: z.string().describe('Ej: genero_cine, idioma, hobby'),
      valor: z.string().describe('El dato específico a recordar')
    }),
    execute: async ({ categoria, valor }) => {
      await savePreference(categoria, valor);
      return { status: 'success', message: `He memorizado que tu ${categoria} es ${valor}` };
    },
  }),

  buscarPeliculas: tool({
    description: 'Busca películas en la base de datos de TMDB por título o género.',
    parameters: z.object({
      busqueda: z.string().describe('El título o tema de la película')
    }),
    execute: async ({ busqueda }) => {
      const resultados = await searchMovies(busqueda);
      return { status: 'success', resultados };
    },
  }),
};