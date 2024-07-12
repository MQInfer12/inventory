interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-primary-700 text-white rounded-xl py-2 outline-none ring-white ring-inset ring-0 focus:ring-2 transition-all duration-300"
    >
      Iniciar sesión
    </button>
  );
};

export default Button;
