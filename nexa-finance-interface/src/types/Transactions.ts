import type { Category, CategorySummary } from "./Category";

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;
//define o valor do transactionType como a string "income" e "expense"
//sem esse trecho o valor é considerado um objeto.
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  updatedAt: string | Date;
  createdAt: string | Date;
  date: string | Date;
  amount: number;
  category: Category;
  userId: string;
}

//DTO -> Data Transfer Object
export interface CreateTransactionDTO {
  description: string;
  categoryId: string;
  type: TransactionType;
  date: string | Date;
  amount: number;
}

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: typeof TransactionType;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}
export interface MonthlyItem {
  name: string;
  expenses: number;
  incomes: number;
}
