import { type Category, TransactionType } from "@prisma/client";
import prisma from "../config/prisma";

type GlobalCategoryInput = Pick<Category, "name" | "color" | "type" | "userId">;

const globalCategories: GlobalCategoryInput[] = [
  // Despesas
  {
    name: "Alimentação",
    color: "#FF5733",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Transporte",
    color: "#33A8FF",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Moradia",
    color: "#33FF57",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Saúde",
    color: "#F033FF",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Educação",
    color: "#FF3366",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Lazer",
    color: "#FFBA33",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Compras",
    color: "#33FFF6",
    type: TransactionType.expense,
    userId: "global",
  },
  {
    name: "Outros",
    color: "#B033FF",
    type: TransactionType.expense,
    userId: "global",
  },

  // Receitas
  {
    name: "Salário",
    color: "#33FF57",
    type: TransactionType.income,
    userId: "global",
  },
  {
    name: "Freelance",
    color: "#33A8FF",
    type: TransactionType.income,
    userId: "global",
  },
  {
    name: "Investimentos",
    color: "#FFBA33",
    type: TransactionType.income,
    userId: "global",
  },
  {
    name: "Outros",
    color: "#B033FF",
    type: TransactionType.income,
    userId: "global",
  },
];

export const initializeGlobalCategories = async (): Promise<Category[]> => {
  const createdCategories: Category[] = [];

  for (const category of globalCategories) {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          name: category.name,
          type: category.type,
          userId: "global",
        },
      });

      if (!existing) {
        const newCategory = await prisma.category.create({ data: category });

        createdCategories.push(newCategory);
      } else {
        createdCategories.push(existing);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return createdCategories;
};
