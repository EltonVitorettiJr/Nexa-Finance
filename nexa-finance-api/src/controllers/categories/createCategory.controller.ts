import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import {
  type CreateCategoryBody,
  createCategorySchema,
} from "../../schemas/category.schema";

export const createCategory = async (
  request: FastifyRequest<{ Body: CreateCategoryBody }>,
  reply: FastifyReply,
) => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send("❌Usuário não autenticado.");
  }

  const result = createCategorySchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(401).send(`❌Dados inválidos. Error: ${result.error}`);
  }

  const { color, name, type } = result.data;

  const normalizedName = name.trim();

  try {
    const categoryExists = await prisma.category.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
        type: type,
        OR: [{ userId: userId }, { userId: "global" }],
      },
    });

    if (categoryExists) {
      return reply.status(409).send("❌Essa categoria já existe.");
    }

    const newCategory = await prisma.category.create({
      data: {
        name: normalizedName,
        color,
        type,
        userId,
      },
    });

    return reply.status(201).send(newCategory);
  } catch (error) {
    return reply.status(500).send({ message: `❌ ${error}` });
  }
};
