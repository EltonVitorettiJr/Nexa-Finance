import { ChevronLeft, ChevronRight } from "lucide-react";

interface SelectPageTransactionsProps {
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  totalPages: number;
  classname?: string;
}

const SelectPageTransactions = ({
  onPageChange,
  onPerPageChange,
  page,
  perPage,
  totalPages,
  classname,
}: SelectPageTransactionsProps) => {
  return (
    <div
      className={`${classname} flex items-center w-full justify-center gap-3`}
    >
      <div className="flex items-center gap-3">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="bg-gray-950 text-gray-100 border border-gray-700 rounded-lg
          px-3 py-1.5 text-sm outline-none focus:border-primary-500 focus:ring-1 
          focus:ring-primary-500 transition-all cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 
          hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium text-gray-300">{page}</span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 
          hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SelectPageTransactions;
