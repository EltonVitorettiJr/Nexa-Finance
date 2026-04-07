import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { categoryRoutes } from "./category.routes";
import { transactionRoutes } from "./transaction.routes";

async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/health", async () => {
    return {
      status: 201,
      message: "✅nexafinance rodando normalmente",
    };
  });

  fastify.addHook("preHandler", authMiddleware);

  fastify.register(categoryRoutes, { prefix: "/categories" });
  fastify.register(transactionRoutes, { prefix: "/transactions" });
}

export default routes;
