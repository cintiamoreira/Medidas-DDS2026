import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credPath = join(__dirname, '../../config/credential.json');

function loadServiceAccount() {
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (envJson) {
    return { source: 'env', account: JSON.parse(envJson) };
  }
  if (!existsSync(credPath)) {
    throw new Error(
      `Credencial Firebase em falta: nem FIREBASE_SERVICE_ACCOUNT_JSON nem ${credPath}`
    );
  }
  return {
    source: 'file',
    account: JSON.parse(readFileSync(credPath, 'utf8')),
  };
}

let app;
try {
  const { source, account: serviceAccount } = loadServiceAccount();
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const pid = serviceAccount.project_id
    ? `project_id: ${serviceAccount.project_id}`
    : 'ok';
  console.log(`Firebase Admin OK (${pid}, credenciais: ${source})`);
} catch (e) {
  console.error('Erro ao iniciar o firebase:', e.message);
}

export const dbFirebase = app ? admin.firestore() : null;
export const authFirebase = app ? admin.auth() : null;
