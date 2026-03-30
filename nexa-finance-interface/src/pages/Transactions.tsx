import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Cards from "../components/Cards";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import {
  deleteTransaction,
  getTransactions,
} from "../services/transactionService";
import { type Transaction, TransactionType } from "../types/Transactions";
import { formatCurrency, formatDate } from "../utils/Formatters";

export const Transactions = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>();

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactions({ month, year });

      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError("Não foi possível carregar as transações, tente novamente.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeletingId(id);

      await deleteTransaction(id);

      toast.success("Transação deletada.");

      setFilteredTransactions((prev) => prev?.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);

      toast.error("Falha ao deletar transação.");
    } finally {
      setDeletingId("");
    }
  };

  const confirmDelete = async (id: string): Promise<void> => {
    if (window.confirm("Tem certeza que deseja deletar essa transação?")) {
      handleDelete(id);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>): void => {
    //é necessário colocar manualmente pois sem não é possível digitar no input
    setSearchText(event.target.value);

    setFilteredTransactions(
      transactions?.filter((transaction) =>
        transaction.description
          .toLocaleUpperCase()
          .includes(event.target.value.toUpperCase()),
      ),
    );
  };

  return (
    <div className="container-app py-6">
      <div
        className="flex flex-col md:flex-row justify-between
        items-start md:items-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        <Link
          to="/nova-transacao"
          className="bg-primary-500 text-[#051626] font-semibold
          px-4 py-2.5 rounded-xl flex items-center justify-center
          hover:bg-primary-600 transition-all"
        >
          <Plus className="h-4 mr-2 w-4" />
          Nova Transação
        </Link>
      </div>
      <Cards className="mb-6">
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </Cards>
      <Cards className="mb-6">
        <Input
          placeholder="Buscar Transações..."
          icon={<Search className="w-4 h-4" />}
          fullWidth
          onChange={handleSearchFilter}
          value={searchText}
        />
      </Cards>

      <Cards className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-fit">
            <div
              className="w-10 h-10 border-4 border-primary-500
            border-t-transparent rounded-full animate-spin"
            />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
            <Button
              onClick={() => fetchTransactions()}
              variant="danger"
              className="mx-auto mt-6"
            >
              Tentar Novamente
            </Button>
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma transação encontrada.</p>
            <Link
              to="/nova-transacao"
              className="bg-primary-500 text-[#051626] font-semibold
            px-4 py-2.5 rounded-xl flex items-center justify-center
             hover:bg-primary-600 transition-all w-fit mx-auto"
            >
              <Plus className="h-4 mr-2 w-4" />
              Nova Transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-700 h-full w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Descrição
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    {" "}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions?.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUp className="w-4 h-4 text-primary-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-50">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{
                            backgroundColor: transaction.category.color,
                          }}
                        />
                        <span className="text-sm text-gray-400">
                          {transaction.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
                      <span
                        className={`${
                          transaction.type === TransactionType.INCOME
                            ? "text-primary-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => confirmDelete(transaction.id)}
                        className="text-red-500 hover:text-red-400 rounded-full
                        cursor-pointer"
                        disabled={deletingId === transaction.id}
                      >
                        {deletingId === transaction.id ? (
                          <span
                            className="inline-block w-4 h-4 border-2
                         border-red-500 border-t-transparent rounded-full animate-spin"
                          ></span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cards>
    </div>
  );
};

export default Transactions;
