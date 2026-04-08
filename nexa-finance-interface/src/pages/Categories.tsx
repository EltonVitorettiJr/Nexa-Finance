import { AlertCircle, PaletteIcon, Save, Trash2Icon } from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Cards from "../components/Cards";
import Input from "../components/Input";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { useAuth } from "../context/AuthContext";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../services/categoryService";
import type { Category } from "../types/Category";
import { type CreateCategoryDTO, TransactionType } from "../types/Transactions";

interface FormData {
  name: string;
  color: string;
  type: TransactionType;
  userId: string;
}

const initialFormData = {
  name: "",
  color: "",
  type: TransactionType.EXPENSE,
  userId: "",
};

export const Categories = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    authState: { user },
  } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();
  const formId = useId();
  const colorInputId = useId();

  const validateForm = (): boolean => {
    if (!formData.name || !formData.color || !formData.type) {
      setError("Preencha os campos corretamente.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    setLoading(true);

    setIsSubmited(true);

    try {
      if (!validateForm()) {
        return;
      }

      const categoryData: CreateCategoryDTO = {
        name: formData.name,
        color: formData.color,
        type: formData.type,
        userId: user?.uid as string,
      };

      const response = await createCategory(categoryData);

      setCategories((prev) => {
        const updatedCategories = [...prev, response];

        return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
      });

      setFormData(initialFormData);

      toast.success("Categoria cadastrada!");
    } catch (err) {
      toast.error("Erro ao cadastrar transação, tente novamente.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryType = (itemType: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type: itemType }));
  };

  const handleChanges = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();

      setCategories(response);
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar essa categoria?")) {
      await deleteCategory(id);

      setCategories((prev) => prev.filter((category) => category.id !== id));

      toast.success("Categoria deletada.");
    }
  };

  return (
    <div className="container-app py-8 flex justify-center gap-16">
      <div className="max-w-100 space-x-8">
        <h1 className="text-2xl font-bold mb-6">Criar Categoria</h1>

        <Cards>
          {error && (
            <div
              className="flex items-center mb-6 p-4 text-sm
            bg-red-300 border-red-500 rounded-xl
            text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor={formId} className="mb-4 flex flex-col gap-2">
                Tipo de Categoria
              </label>
              <TransactionTypeSelector
                onChange={handleCategoryType}
                value={formData.type}
                id={formId}
              />
            </div>

            <Input
              label="Nome da Categoria"
              name="name"
              value={formData.name}
              onChange={handleChanges}
              placeholder="Ex: Supermercado, Salário, etc..."
              required
              error={isSubmited && formData.name === ""}
            />

            <div className="gap-3">
              <label
                htmlFor={colorInputId}
                className="block text-sm text-gray-50 mb-2"
              >
                Cor da Categoria
              </label>

              <div className="flex items-center w-full gap-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color || "#8b5cf6"}
                  onChange={handleChanges}
                  className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer bg-transparent overflow-hidden shrink-0"
                  title="Escolha uma cor"
                  id={colorInputId}
                />

                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleChanges}
                  placeholder="#8b5cf6"
                  icon={<PaletteIcon className="w-4 h-4" />}
                  required
                  fullWidth
                  error={isSubmited && formData.color === ""}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-red-500 text-red-500 hover:bg-red-100"
                disabled={loading === true}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant={
                  formData.type === TransactionType.EXPENSE
                    ? "danger"
                    : "success"
                }
                isLoading={loading}
                disabled={loading === true}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-fit">
                    <div
                      className="w-4 h-4 border-4 border-gray-700
                      border-t-transparent rounded-full animate-spin"
                    />
                  </div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </form>
        </Cards>
      </div>
      <div className="max-w-130 w-full">
        <h1 className="text-2xl font-bold mb-6">Editar Categorias</h1>
        <Cards className="overflow-y-auto h-115 pt-0">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky top-0 bg-gray-900 z-10 border-b-2 border-white text-left font-medium leading-9">
                  Nome
                </th>
                <th className="sticky top-0 bg-gray-900 z-10 border-b-2 border-white text-left font-medium leading-9">
                  Cor
                </th>
                <th className="sticky top-0 bg-gray-900 z-10 border-b-2 border-white text-left font-medium leading-9">
                  Tipo
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="leading-8 hover:bg-gray-800/50"
                >
                  <td className="border-b border-gray-600">{category.name}</td>
                  <td
                    style={{ color: category.color }}
                    className="border-b border-gray-600"
                  >
                    {category.color}
                  </td>
                  <td
                    className={`${category.type === TransactionType.EXPENSE ? "text-red-600" : "text-green-600"}
                    flex justify-between border-b border-gray-600`}
                  >
                    {category.type}
                    {category.userId !== "global" && (
                      <button
                        type="button"
                        className="bg-transparent border-none cursor-pointer mr-1"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2Icon className="text-red-600 h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cards>
      </div>
    </div>
  );
};

export default Categories;
