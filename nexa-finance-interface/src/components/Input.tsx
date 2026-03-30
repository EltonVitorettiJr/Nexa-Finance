import { type InputHTMLAttributes, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  icon?: ReactNode;
  label?: string;
  error?: boolean;
  id?: string;
}

const Input = ({
  error,
  fullWidth,
  icon,
  label,
  id,
  className,
  ...rest
}: InputProps) => {
  const generatedId = useId();
  const InputId = id || generatedId;

  return (
    <div className={`${fullWidth ? "w-full" : ""}mb-1`}>
      {label && (
        <label
          htmlFor={InputId}
          className="block text-sm font-medium text-gray-50 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-2 top-2 pl-0 flex items-center
          cursor-pointer text-gray-400"
          >
            {icon}
          </div>
        )}
      </div>
      <input
        id={InputId}
        className={`block w-full rounded-xl border
        ${error ? "border-red-500" : "border-gray-700"}
        bg-gray-800 px-4 py-3 text-sm text-gray-50 transition-all
        focus:outline-none focus:ring-2
        ${
          error
            ? "focus:border-red-500 focus:ring-red-500/2"
            : "focus:border-primary-500 focus:ring-primary-500/2"
        }
        ${icon ? "pl-7" : ""}
        ${className}
      `}
        {...rest}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
