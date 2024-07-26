import { twMerge } from "@/utils/twMerge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon: JSX.Element;
  btnType?: "primary" | "secondary";
  hideOnScreen?: boolean;
  full?: boolean;
  size?: "base" | "input";
}

const ControlButton = ({
  icon,
  text,
  btnType = "secondary",
  hideOnScreen = false,
  full,
  size = "base",
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={twMerge(
        "flex text-sm border rounded-lg items-center px-3 gap-2 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 hover:opacity-70 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-white disabled:hover:opacity-100",
        btnType === "secondary"
          ? "text-primary-700 bg-white border-gray-300 ring-primary-700/50"
          : "text-white bg-primary-700 border-transparent ring-white",
        size === "base" ? "h-8" : "h-[38px]",
        full && "flex-1 justify-center"
      )}
    >
      {text && (
        <p
          className={twMerge(
            "whitespace-nowrap font-semibold",
            hideOnScreen && "max-lg:hidden"
          )}
        >
          {text}
        </p>
      )}
      <div className="h-full aspect-square p-1">{icon}</div>
    </button>
  );
};

export default ControlButton;
