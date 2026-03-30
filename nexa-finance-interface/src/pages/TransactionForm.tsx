import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
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
import Select from "../components/Select";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/Category";
import {
  type CreateTransactionDTO,
  TransactionType,
} from "../types/Transactions";

interface FormData {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const initialFormData = {
  description: "",
  amount: 0,
  date: "",
  categoryId: "",
  type: TransactionType.EXPENSE,
};

export const TransactionForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const formId = useId();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();

      setCategories(response);
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type,
  );

  const validateForm = (): boolean => {
    if (
      !formData.description ||
      !formData.amount ||
      !formData.date ||
      !formData.categoryId
    ) {
      setError("Preencha os campos corretamente.");
      return false;
    }

    if (formData.amount <= 0) {
      setError("O valor deve ser maior que 0.");
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

      const transactionData: CreateTransactionDTO = {
        amount: formData.amount,
        categoryId: formData.categoryId,
        date: `${formData.date}T12:00:00.000Z`,
        description: formData.description,
        type: formData.type,
      };

      await createTransaction(transactionData);

      toast.success("Transação adicionada com sucesso!");
    } catch (err) {
      toast.error("Erro ao cadastrar transação, tente novamente.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionType = (itemType: TransactionType): void => {
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>

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
                Tipo de Transação
              </label>
              <TransactionTypeSelector
                onChange={handleTransactionType}
                value={formData.type}
                id={formId}
              />
            </div>

            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChanges}
              placeholder="Ex: Supermercado, Salário, etc..."
              required
              error={isSubmited && formData.description === ""}
            />

            <Input
              label="Valor"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChanges}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
              required
              error={isSubmited && formData.amount === 0}
            />

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChanges}
              placeholder="R$ 0,00"
              icon={<Calendar className="w-4 h-4" />}
              required
              error={isSubmited && formData.date === ""}
            />

            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChanges}
              icon={<Tag className="w-4 h-4" />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              ]}
              error={isSubmited && formData.description === ""}
            />

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

export default TransactionForm;
