import { ChevronDown } from "lucide-react";
import { type ReactNode, type SelectHTMLAttributes, useId } from "react";

interface SelectOptions {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: boolean;
  icon?: ReactNode;
  fullwidth?: boolean;
  options: SelectOptions[];
}

const Select = ({
  icon,
  label,
  error,
  fullwidth,
  options,
  className = "",
  id,
  ...rest
}: SelectProps) => {
  const selectId = useId();

  return (
    <div className={`${fullwidth ? "w-full" : ""} mb-2 relative`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-50 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className="absolute inset-y-0 top-4 left-0 pl-2 flex
          items-center text-gray-400"
          >
            {icon}
          </div>
        )}
      </div>

      <select
        id={selectId}
        {...rest}
        className={`block w-full bg-gray-800 py-3 pl-7 pr-4
          rounded-xl text-gray-50 text-sm outline-none
          appearance-none border
          ${error ? "border-red-500" : "border-gray-700"}
          ${error ? "focus:border-red-500" : "focus:border-primary-500"}
          `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className="absolute inset-y-0 right-0 top-6 flex
      items-center pr-3"
      >
        <ChevronDown
          className="h-5 w-5 text-gray-400
        absolute top-4.5 right-4"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
