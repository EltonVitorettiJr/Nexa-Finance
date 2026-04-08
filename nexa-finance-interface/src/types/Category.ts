import type { TransactionType } from "./Transactions";

export interface Category {
  id: string;
  name: string;
  color: string;
  type: TransactionType;
  userId: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;

  [key: string]: string | number;
}
