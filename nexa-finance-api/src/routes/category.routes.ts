import type { FastifyInstance } from "fastify";
import { createCategory } from "../controllers/categories/createCategory.controller";
import { deleteCategory } from "../controllers/categories/deleteCategory.controller";
import { getCategories } from "../controllers/categories/getCategories.controller";

export const categoryRoutes = async (
  fastify: FastifyInstance,
): Promise<void> => {
  fastify.get("/", getCategories);
  fastify.post("/", createCategory);
  fastify.delete("/:id", deleteCategory);
};
