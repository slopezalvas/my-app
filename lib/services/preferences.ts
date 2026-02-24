import { db } from '@/lib/db';
import { userPreferences } from '@/lib/db/schema';


/** Guarda o actualiza una preferencia del usuario.*/
export async function savePreference(key: string, value: string) {
  try {
    const result = await db
      .insert(userPreferences)
      .values({ key, value })
      .onConflictDoUpdate({
        target: userPreferences.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    
    return result[0];
  } catch (error) {
    console.error('Error en savePreference:', error);
    throw new Error('No se pudo guardar la preferencia');
  }
}

/**  GET preferencias para el prompt del sistema.*/
export async function getPreferences() {
  try {
    const prefs = await db.select().from(userPreferences);
    return prefs.map(p => `${p.key}: ${p.value}`).join(', ');
  } catch (error) {
    console.error('Error en getPreferences:', error);
    return '';
  }
}