import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import {
  type DeleteCategoryParams,
  deleteCategorySchema,
} from "../../schemas/category.schema";

export const deleteCategory = async (
  request: FastifyRequest<{ Params: DeleteCategoryParams }>,
  reply: FastifyReply,
) => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send("❌Usuário não autenticado.");
  }

  const result = deleteCategorySchema.safeParse(request.params);

  if (!result.success) {
    return reply.status(401).send("❌Dados inválidos.");
  }

  const { id } = result.data;

  try {
    await prisma.category.delete({
      where: {
        id,
        userId,
      },
    });

    return reply.status(200).send("Transação deletada com sucesso!");
  } catch (err) {
    reply.status(500).send(`❌Erro interno no servidor: ${err}`);
  }
};
