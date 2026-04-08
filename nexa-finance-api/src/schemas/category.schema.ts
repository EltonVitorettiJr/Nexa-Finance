import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import z from "zod";

export const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createCategorySchema = z.object({
  name: z.string().max(40),
  color: z.string().length(7).startsWith("#"),
  type: z.enum([TransactionType.expense, TransactionType.income]),
});

export const deleteCategorySchema = z.object({
  id: z.string().refine(isValidObjectId, "Id de Categoria inválido."),
});

export type DeleteCategoryParams = z.infer<typeof deleteCategorySchema>;

export type CreateCategoryBody = z.infer<typeof createCategorySchema>;
