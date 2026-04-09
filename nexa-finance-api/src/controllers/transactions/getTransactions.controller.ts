import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send("Usuário não autenticado.");
  }

  const { month, year, categoryId, type, page, perPage } = request.query;

  const filter: TransactionFilter = { userId };

  if (month && year) {
    const startDate = dayjs
      .utc(`${year}-${month}-01`)
      .startOf("month")
      .toDate();
    const endDate = dayjs.utc(startDate).endOf("month").toDate();
    filter.date = { gte: startDate, lte: endDate };
  }

  if (type) {
    filter.type = type;
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  try {
    if (page && perPage) {
      const skip = (Number(page) - 1) * Number(perPage);
      const take = Number(perPage);

      const [transactions, totalItems] = await prisma.$transaction([
        prisma.transaction.findMany({
          where: filter,
          skip,
          take,
          orderBy: { date: "desc" },
          include: {
            category: {
              select: { color: true, name: true, type: true, userId: true },
            },
          },
        }),

        prisma.transaction.count({ where: filter }),
      ]);

      const totalPages = Math.ceil(totalItems / take);

      return reply.status(200).send({
        data: transactions,
        meta: { totalItems, totalPages, currentPage: Number(page) },
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
            userId: true,
          },
        },
      },
    });

    return reply.status(200).send({ data: transactions });
  } catch (err) {
    reply.status(500).send(`❌Erro interno no servidor: ${err}`);
  }
};
