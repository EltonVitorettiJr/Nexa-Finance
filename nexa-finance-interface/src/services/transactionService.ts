import type {
  CreateTransactionDTO,
  MonthlyItem,
  Transaction,
  TransactionFilter,
  TransactionSummary,
} from "../types/Transactions";
import { api } from "./api";

interface MetaTransactionReply {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface GetTransactionsReply {
  data: Transaction[];
  meta: MetaTransactionReply;
}

export const getTransactions = async (
  filter?: Partial<TransactionFilter>,
): Promise<GetTransactionsReply> => {
  const response = await api.get<GetTransactionsReply>("/transactions", {
    params: filter,
  });

  return response.data;
};

export const getTransactionsSummary = async (
  month: number,
  year: number,
): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>("/transactions/summary", {
    params: {
      month,
      year,
    },
  });

  return response.data;
};

export const getTransactionsMonthly = async (
  month: number,
  year: number,
  months?: number,
): Promise<{ history: MonthlyItem[] }> => {
  const response = await api.get("/transactions/historical", {
    params: {
      month,
      year,
      months,
    },
  });

  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const createTransaction = async (
  TransactionData: CreateTransactionDTO,
): Promise<Transaction> => {
  const response = await api.post<Transaction>(
    "/transactions",
    TransactionData,
  );

  return response.data;
};
