import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import * as z from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  amount: z.number().positive("O valor deve ser positivo."),
  date: z.string().refine(
    (val) => !Number.isNaN(Date.parse(val)), //verificação se a data é válida
    "Data inválida ou formato incorreto.",
  ),
  categoryId: z.string().refine(isValidObjectId, "Id de Categoria inválido."),
  type: z.enum([TransactionType.expense, TransactionType.income]),
});

export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, "Id de Categoria inválido.")
    .optional(),
  type: z.enum([TransactionType.expense, TransactionType.income]).optional(),
});

export const getSummaryTransactionsSchema = z.object({
  month: z.string("O mês é obrigatório."),
  year: z.string("O ano é obrigatório."),
});

export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, "Id de Categoria inválido."),
});

export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;

export type GetSummaryTransactionsQuery = z.infer<
  typeof getSummaryTransactionsSchema
>;

export type GetHistoricalTransactionsQuery = z.infer<
  typeof getHistoricalTransactionsSchema
>;

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
