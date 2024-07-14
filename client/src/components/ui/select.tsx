import { twMerge } from "@/utils/twMerge";
import React, { useId } from "react";

interface Props {
  title: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  dark?: boolean;
  required?: boolean;
}

const Select = ({
  children,
  onChange,
  title,
  value,
  dark,
  required,
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
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={twMerge(
          "form-input text-sm w-full bg-bg-300 rounded-xl pl-3 py-2 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 pr-10 border placeholder:font-medium font-medium",
          dark
            ? "bg-bg-200 text-white border-bg-800 placeholder:text-white/20 ring-primary-700"
            : "bg-white text-black/80 border-gray-300 placeholder:text-black/40 ring-primary-700/50"
        )}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
