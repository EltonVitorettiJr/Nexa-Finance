import { TransactionType } from "../types/Transactions";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  id?: string;
  onChange: (type: TransactionType) => void;
}

const TransactionTypeSelector = ({
  onChange,
  value,
  id,
}: TransactionTypeSelectorProps) => {
  const transactionsTypeButtons = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-100 border-red-500 text-red-600 font-medium",
      inactiveClasses:
        "bg-transparent border-red-300 text-red-500 font-medium hover:bg-red-50",
    },
    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-green-100 border-green-500 text-green-600 font-medium",
      inactiveClasses:
        "bg-transparent border-green-300 text-green-500 hover:text-green-600 font-medium hover:bg-green-100",
    },
  ];

  return (
    //semelhante a uma div comum, mas reconhece botões de escolha única.
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionsTypeButtons.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={`flex items-center justify-center border rounded-md py-2 px-4 transition-all
            ${value === item.type ? item.activeClasses : item.inactiveClasses}
            cursor-pointer`}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
