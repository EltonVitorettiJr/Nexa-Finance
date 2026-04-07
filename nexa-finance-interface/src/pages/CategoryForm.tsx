import { AlertCircle, PaletteIcon, Save } from "lucide-react";
import { type ChangeEvent, type FormEvent, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Cards from "../components/Cards";
import Input from "../components/Input";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { useAuth } from "../context/AuthContext";
import { createCategory } from "../services/categoryService";
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

export const CategoryForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    authState: { user },
  } = useAuth();

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

      await createCategory(categoryData);

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
    navigate("/transacoes");
  };

  return (
    <div className="container-app py-8">
      <div className="max-w-100 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Categoria</h1>

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

            <div className="flex justify-end space-x-3">
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
    </div>
  );
};

export default CategoryForm;
