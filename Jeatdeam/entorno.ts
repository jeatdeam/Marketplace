import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// se importa primero en app.ts para que todos los modulos vean las variables.
// en local se leen de Jeatdeam/.env; en Render no hay archivo: las variables vienen del panel (Environment)
const ARCHIVO = fileURLToPath(new URL('./.env', import.meta.url));

if (fs.existsSync(ARCHIVO)) {
    const result = dotenv.config({ path: ARCHIVO });
    if (result.error) console.error('⚠️ Error al cargar .env:', result.error);
    else console.log('✅ Archivo .env cargado correctamente.');
} else {
    console.log('ℹ️ Sin Jeatdeam/.env: se usan las variables de entorno del sistema.');
}

export const enProduccion = process.env.NODE_ENV === 'production';
