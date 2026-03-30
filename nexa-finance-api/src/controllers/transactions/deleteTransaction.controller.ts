import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(400).send("Usuário não autenticado.");
  }

  const { id } = request.params;

  const transactionExists = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!transactionExists) {
    return reply.status(400).send("Transação não encontrada, tente novamente.");
  }

  try {
    await prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });

    return reply.status(200).send("Transação deletada com sucesso!");
  } catch (err) {
    return reply.status(500).send(err);
  }
};
