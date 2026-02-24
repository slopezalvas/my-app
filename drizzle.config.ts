import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';


dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts', // Ruta a archivo de tablas
  out: './drizzle',             // Carpeta de migraciones
  dialect: 'postgresql',        // El motor de base de datos
  dbCredentials: {
    url: process.env.DATABASE_URL!, // La URL de Neon 
  },
});