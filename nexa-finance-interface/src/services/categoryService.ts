import type { Category } from "../types/Category";
import type { CreateCategoryDTO } from "../types/Transactions";
import { api } from "./api";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/categories");

    return response.data;
  } catch (err) {
    throw new Error(`Erro interno do servidor: ${err}`);
  }
};

export const createCategory = async (
  categoryData: CreateCategoryDTO,
): Promise<Category> => {
  try {
    const response = await api.post("/categories", {
      data: categoryData,
    });

    return response.data;
  } catch (err) {
    throw new Error(`Erro interno do servidor: ${err}`);
  }
};
