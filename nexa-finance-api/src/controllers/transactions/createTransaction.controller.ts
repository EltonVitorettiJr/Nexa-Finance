import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import {
  type CreateTransactionBody,
  createTransactionSchema,
} from "../../schemas/transaction.schema";

export const createTransaction = async (
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send("❌Usuário não autenticado.");
  }

  const result = createTransactionSchema.safeParse(request.body);

  if (!result.success) {
    const errors = result.error;
    return reply.status(400).send({ message: "❌Dados inválidos", errors });
  }

  const { categoryId, type, date, ...rest } = result.data;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        type: type,
      },
    });

    if (!category) {
      return reply.status(401).send("❌Essa categoria não existe.");
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        ...rest,
        categoryId,
        type,
        date: new Date(date), // Conversão manual
        userId,
      },
      include: {
        category: true,
      },
    });

    return reply.status(201).send(newTransaction);
  } catch (err) {
    return reply.status(500).send({ message: `❌ ${err}` });
  }
};
