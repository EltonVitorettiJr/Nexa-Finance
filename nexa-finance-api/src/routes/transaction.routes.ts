import type { FastifyInstance } from "fastify";
import * as z from "zod";
import { createTransaction } from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller";
import { getSummaryTransactions } from "../controllers/transactions/getSummaryTransactions.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getHistoricalTransactionsSchema,
  getSummaryTransactionsSchema,
  getTransactionsSchema,
} from "../schemas/transaction.schema";

export const transactionRoutes = async (
  fastify: FastifyInstance,
): Promise<void> => {
  const postBodySchema = z.toJSONSchema(createTransactionSchema);
  delete postBodySchema.$schema;

  const getQueryParamsSchema = z.toJSONSchema(getTransactionsSchema);
  delete getQueryParamsSchema.$schema;

  const summaryQueryParamsSchema = z.toJSONSchema(getSummaryTransactionsSchema);
  delete summaryQueryParamsSchema.$schema;

  const historicalQueryParamsSchema = z.toJSONSchema(
    getHistoricalTransactionsSchema,
  );
  delete historicalQueryParamsSchema.$schema;

  const deleteQueryTransactionSchema = z.toJSONSchema(deleteTransactionSchema);
  delete deleteQueryTransactionSchema.$schema;

  fastify.addHook("preHandler", authMiddleware);

  //Criação de uma transação
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: postBodySchema,
    },
    handler: createTransaction,
  });

  //Consultar as transações com filtros
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: getQueryParamsSchema,
    },
    handler: getTransactions,
  });

  //resumo de transações
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: summaryQueryParamsSchema,
    },
    handler: getSummaryTransactions,
  });

  //histórico de transações
  fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
      querystring: historicalQueryParamsSchema,
    },
    handler: getHistoricalTransactions,
  });

  //deletar uma transação
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: deleteQueryTransactionSchema,
    },
    handler: deleteTransaction,
  });
};
