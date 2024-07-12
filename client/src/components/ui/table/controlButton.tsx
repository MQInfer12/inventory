import { twMerge } from "@/utils/twMerge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon: JSX.Element;
  btnType?: "primary" | "secondary";
}

const ControlButton = ({
  icon,
  text,
  btnType = "secondary",
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={twMerge(
        "flex text-sm border h-8 rounded-lg items-center px-3 gap-2 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 hover:opacity-70",
        btnType === "secondary"
          ? "text-primary-700 bg-white border-gray-300"
          : "text-white bg-primary-700 border-primary-700 ring-white"
      )}
    >
      {text && <p className="whitespace-nowrap font-semibold">{text}</p>}
      <div className="h-full aspect-square p-1">{icon}</div>
    </button>
  );
};

export default ControlButton;
