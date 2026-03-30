import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  if (admin.apps.length > 0) return;

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } =
    env;

  if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error(
      "❌Falha ao iniciar o firebase, credenciais não detectadas.",
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
        projectId: FIREBASE_PROJECT_ID,
      }),
    });
  } catch (err) {
    console.log("❌Falha ao conectar o firebase", err);
    process.exit(1); //para a aplicação indicando que tem um erro
  }
};

export default initializeFirebaseAdmin;
