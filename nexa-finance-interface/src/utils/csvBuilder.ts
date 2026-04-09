import { toast } from "react-toastify";
import { getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/Transactions";

export const downloadTransactionsCsv = async (month: number, year: number) => {
  try {
    //Chamada a API
    toast.info("Gerando seu relatório...");

    const response = await getTransactions({ month, year });
    const allTransactions = response.data || response;

    //Formatação para arquivo em CSV
    const headers = ["Descrição", "Data", "Categoria", "Valor", "Tipo"];

    const dataRows = allTransactions.map((t: Transaction) => {
      const formattedDate = new Date(t.date).toLocaleDateString("pt-BR");

      const translatedType = t.type === "income" ? "Receita" : "Despesa";

      const categoryName = t.category?.name || t.category;

      return [
        t.description,
        formattedDate,
        categoryName,
        `R$ ${t.amount.toFixed(2)}`,
        translatedType,
      ];
    });
    const csvContent = [headers, ...dataRows];

    const csvString = csvContent
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");

    const blob = new Blob([`\uFEFF${csvString}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Nexa-Transacoes-${month}-${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download concluído!");
  } catch (err) {
    console.error(err);
    toast.error("Erro ao gerar o arquivo CSV.");
  }
};
