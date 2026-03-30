import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prisma";

export const getCategories = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    reply.status(201).send(categories);
  } catch (err) {
    reply.status(401).send({ error: "❌Erro ao procurar categoria.", err });
    // request.log.error({ error: "Error when searching categories", err });
    // Também é possível utilizar o tratamento de erro acima, porém ele aparece somente no log do terminal
  }
};
