import { tool } from 'ai';
import { z } from 'zod';
import { savePreference } from '@/lib/services/preferences';
import { discoverMovies } from '@/lib/services/movies';

export const getAiTools = (userId: string) => ({
  guardarGustoUsuario: tool({
    description: 'Guarda información importante sobre los gustos del usuario.',
    parameters: z.object({
      categoria: z.string().describe('Ej: nombre, genero, actor, director'),
      valor: z.string().describe('El dato específico a recordar')
    }),
    execute: async ({ categoria, valor }) => {
      await savePreference(userId, categoria, valor);
      return { 
        status: 'success', 
        message: `He memorizado que tu ${categoria} es ${valor}` 
      };
    },
  }),

  buscarPeliculas: tool({
    description: 'Busca películas por título, género o año.',
    parameters: z.object({
      busqueda: z.string().optional().describe('Título específico si el usuario lo mencionó'),
      generoId: z.number().optional().describe('ID del género de TMDB'),
      año: z.number().optional().describe('Año de estreno')
    }),
    execute: async (params) => {
      const resultados = await discoverMovies(params);
      return { status: 'success', resultados };
    },
  }),

});