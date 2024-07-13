import { useId } from "react";

interface Props {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const Input = ({
  title,
  placeholder,
  onChange,
  value,
  type = "text",
}: Props) => {
  const id = useId();

  return (
    <div className="relative flex flex-col gap-2">
      <label className="text-white pl-4 text-sm" htmlFor={id}>
        {title}
      </label>
      <input
        id={id}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="bg-bg-200 w-full bg-bg-300 rounded-xl text-white pl-4 py-2 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 ring-primary-700 pr-10 border border-bg-800 placeholder:text-white/20"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
