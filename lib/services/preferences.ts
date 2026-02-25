import { db } from '@/lib/db';
import { userPreferences } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

/** SAVE o UPDATE una preferencia del usuario.*/
export async function savePreference(userId: string, key: string, value: string) {
  try {
    const existing = await db
      .select()
      .from(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.key, key)))
      .limit(1);

    let newValue = value;

    if (existing.length > 0 && key !== 'nombre') {
      const currentValues = existing[0].value.split(', ');
      if (!currentValues.includes(value)) {
        newValue = [...currentValues, value].join(', ');
      } else {
        newValue = existing[0].value; // Se queda igual
      }
    }

    const result = await db
      .insert(userPreferences)
      .values({ userId, key, value: newValue })
      .onConflictDoUpdate({
        target: [userPreferences.userId, userPreferences.key],
        set: { value: newValue, updatedAt: new Date() },
      })
      .returning();
    
    return result[0];
  } catch (error) {
    console.error('Error en savePreference:', error);
    throw new Error('No se pudo guardar');
  }
}

/**  GET preferencias del usuario para el prompt del sistema.*/
export async function getPreferences(userId: string) {
  try {
    const prefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return prefs.map(p => `${p.key}: ${p.value}`).join(', ');
  } catch (error) {
    console.error('Error en getPreferences:', error);
    return '';
  }
}