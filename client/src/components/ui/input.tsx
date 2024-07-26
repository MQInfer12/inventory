import { twMerge } from "@/utils/twMerge";
import { useId } from "react";

interface Props {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  dark?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const Input = ({
  title,
  placeholder,
  onChange,
  value,
  type = "text",
  dark,
  required,
  disabled,
}: Props) => {
  const id = useId();

  return (
    <div className="relative flex flex-col flex-1 min-w-56">
      <label
        className={twMerge(
          "pl-4 pb-2 text-sm font-medium",
          dark ? "text-white" : "text-primary-700",
          required && "after:content-['_*'] after:text-rose-800 after:font-bold"
        )}
        htmlFor={id}
      >
        {title}
      </label>
      <input
        id={id}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className={twMerge(
          "form-input text-sm w-full bg-bg-300 rounded-lg pl-4 py-2 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 pr-10 border placeholder:font-medium font-medium",
          dark
            ? "bg-bg-200 text-white border-bg-800 placeholder:text-white/20 ring-primary-700"
            : "bg-white text-black/80 border-gray-300 placeholder:text-black/40 ring-primary-700/50",
          "disabled:bg-gray-200"
        )}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
