import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";

export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send("❌Usuário não autenticado.");
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: "global" }, { userId }],
      },
      orderBy: { name: "asc" },
    });

    return reply.status(201).send(categories);
  } catch (err) {
    return reply
      .status(500)
      .send({ error: "❌Erro ao procurar categoria.", err });
    // request.log.error({ error: "Error when searching categories", err });
    // Também é possível utilizar o tratamento de erro acima, porém ele aparece somente no log do terminal
  }
};
