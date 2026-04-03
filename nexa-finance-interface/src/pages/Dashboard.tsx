import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
} from "recharts";
import Cards from "../components/Cards";
import MonthYearSelect from "../components/MonthYearSelect";
import {
  getTransactionsMonthly,
  getTransactionsSummary,
} from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/Transactions";
import { formatCurrency } from "../utils/Formatters";
import type { CategorySummary } from "../types/Category";

// Tradução: "Pega tudo do PieLabelRenderProps, MENOS (omit) o payload.
// E aí adiciona o payload novo com o tipo CategorySummary."
type ChartLabelProps = Omit<PieLabelRenderProps, "payload"> & {
  payload: CategorySummary;
};

type ChartShapeProps = Omit<PieLabelRenderProps, "payload"> & {
  payload: CategorySummary;
};

const initialSummary: TransactionSummary = {
  balance: 0,
  expensesByCategory: [],
  totalExpenses: 0,
  totalIncomes: 0,
};

const RenderPieChart = (props: PieSectorShapeProps) => {
  const {payload} = props as ChartShapeProps

  return (
    <Sector {...props} fill={payload.categoryColor}>

    </Sector>
  )
}

// É necessário colocar na entrada de parametros o tipo PieLabelRenderProps
// pois o componente <Pie> promete chamar a função label passando um objeto genérico
// (PieLabelRenderProps). Mas estamos criando uma função que EXIGE receber um objeto
//  específico (ChartLabelProps). Se o componente mandar algo que não tem o
// CategorySummary a função quebraria
const renderPieChartLabel = (props: PieLabelRenderProps) => {
  const { x, y, textAnchor, percent, payload, name } =
    props as ChartLabelProps;

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline="central"
      style={{ fontSize: "12px", fontWeight: "bold" }}
      fill={payload.categoryColor}
    >
      {`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const currentDate = new Date();
  // por padrão, jan é o mês 0
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [summary, setSummary] = useState(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const result = await getTransactionsSummary(month, year);

      setSummary(result);
    }

    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const result = await getTransactionsMonthly(month, year, 4);

      setMonthlyItemsData(result.history);
    }

    loadTransactionsMonthly();
  }, [month, year]);

  const formatToolTipValue = (value: number | string | undefined): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Cards
          title="Saldo"
          icon={<Wallet className="text-primary-500" size={20} />}
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
            ${summary.balance > 0 ? "text-primary-500" : "text-red-500"}
            
          `}
          >
            {summary.balance < 0 ? "- " : ""}
            {formatCurrency(summary.balance)}
          </p>
        </Cards>

        <Cards
          title="Receitas"
          icon={<ArrowUp className="text-primary-500" size={20} />}
          hover
        >
          <p className={"text-2xl font-semibold mt-2 text-primary-500"}>
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Cards>

        <Cards
          title="Despesas"
          icon={<Wallet className="text-red-500" size={20} />}
          hover
        >
          <p className="text-2xl font-semibold mt-2 text-red-500">
            - {formatCurrency(summary.totalExpenses)}
          </p>
        </Cards>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mb-6 mt-3 gap-4">
        <Cards
          icon={<TrendingUp className="text-primary-500" size={20} />}
          title="Despesas por Categoria"
          className="min-h-80"
          hover
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <PieChart
              style={{
                width: "100%",
                maxHeight: "100%",
                aspectRatio: 1,
              }}
              responsive
              >
                <Pie
                  data={summary.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="amount"
                  nameKey="categoryName"
                  isAnimationActive={true}
                  shape={RenderPieChart}
                  label={renderPieChartLabel}
                />
                <Tooltip formatter={(value) => formatToolTipValue(Number(value))} />
              </PieChart>
            </div>
          ) : (
            <div className="flex justify-center items-center text-gray-500 h-64">
              <p>Nenhuma despesa registrada nesse período.</p>
            </div>
          )}
        </Cards>

        <Cards
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-88"
          hover
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <BarChart
                style={{ width: "100%", maxHeight: "100%", aspectRatio: 1.618 }}
                responsive
                data={monthlyItemsData}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94b3b8"
                  tick={{ style: { textTransform: "capitalize" } }}
                />
                <YAxis
                  width="auto"
                  stroke="#94b3b8"
                  tickFormatter={formatToolTipValue}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#2a2a2a",
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                  formatter={(value) => formatToolTipValue(Number(value))}
                />
                <Legend />
                <Bar
                  dataKey="expenses"
                  fill="#ff5873"
                  radius={[10, 10, 0, 0]}
                />
                <Bar dataKey="incomes" fill="#37E359" radius={[10, 10, 0, 0]} />
              </BarChart>
            ) : (
              <div className="flex justify-center items-center text-gray-500 h-64">
                <p>Nenhuma despesa registrada nesse período.</p>
              </div>
            )}
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default Dashboard;
