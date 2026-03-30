import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("✅Database conectada com sucesso!");
  } catch (err) {
    console.log(err);
  }
};

export default prisma;
