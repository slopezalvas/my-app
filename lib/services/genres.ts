import { db } from '@/lib/db';
import { genres } from '@/lib/db/schema';

export async function syncGenres() {
  try {
    console.log('--- Iniciando sincronización de géneros con TMDB ---');
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=es-ES`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('No se pudo conectar con TMDB para géneros');

    const data = await res.json();

    const insertPromises = data.genres.map((g: { id: number; name: string }) =>
      db.insert(genres).values({ 
        id: g.id, 
        name: g.name 
      }).onConflictDoUpdate({
        target: genres.id,
        set: { name: g.name }
      })
    );

    await Promise.all(insertPromises);
    console.log('✅ Géneros sincronizados exitosamente.');
  } catch (error) {
    console.error('❌ Error en syncGenres:', error);
  }
}

export async function getAllGenres() {
  try {
    let result = await db.select().from(genres);

    if (result.length === 0) {
      console.log('⚠️ Tabla de géneros vacía. Sincronizando...');
      await syncGenres();
      result = await db.select().from(genres);
    }

    return result.map(g => `${g.name} (ID: ${g.id})`).join(', ');
  } catch (error) {
    console.error('Error en getAllGenres:', error);
    return '';
  }
}