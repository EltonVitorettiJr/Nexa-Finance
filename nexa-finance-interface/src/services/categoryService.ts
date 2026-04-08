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
  const { color, name, type, userId } = categoryData;

  try {
    const response = await api.post<Category>("/categories", {
      name,
      color,
      type,
      userId,
    });

    return response.data;
  } catch (err) {
    throw new Error(`Erro interno do servidor: ${err}`);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (err) {
    throw new Error(`Erro interno do servidor: ${err}`);
  }
};
