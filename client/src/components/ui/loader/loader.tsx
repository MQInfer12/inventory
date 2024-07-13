import "./loader.css";

interface Props {
  text?: string;
}

const Loader = ({ text }: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <span className="loader"></span>
      <p className="font-semibold text-primary-800">{text || "Cargando..."}</p>
    </div>
  );
};

export default Loader;
