import app from "./app.js";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase.js";
import { prismaConnect } from "./config/prisma.js";
import { initializeGlobalCategories } from "./services/globalCategories.service.js";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();

    await initializeGlobalCategories();

    await app
      .listen({ port: PORT, host: "0.0.0.0" })
      .then(() => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

startServer();
