import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let app;
try {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(__dirname, '../../config/firebase-service-account.json');
  const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'));
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase iniciado');
} catch (e) {
  console.error('Erro ao iniciar o firebase:', e.message);
}

export const db = app ? admin.firestore() : null;
export const auth = app ? admin.auth() : null;
