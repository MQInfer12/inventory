interface Props {
  text: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({ disabled, text, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-primary-700 text-white rounded-xl py-2 outline-none ring-white ring-inset ring-0 focus:ring-2 transition-all duration-300 disabled:grayscale"
    >
      {text}
    </button>
  );
};

export default Button;
