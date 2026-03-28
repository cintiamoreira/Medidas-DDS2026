import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const credPath = join(__dirname, '../../config/firebase-service-account.json');

let app;
try {
  const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'));
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(
    serviceAccount.project_id
      ? `Firebase Admin OK (project_id: ${serviceAccount.project_id})`
      : 'Firebase Admin OK'
  );
} catch (e) {
  console.error('Erro ao iniciar o firebase:', e.message);
}

export const dbFirebase = app ? admin.firestore() : null;
export const authFirebase = app ? admin.auth() : null;
