import "./loader.css";

interface Props {
  icon?: boolean;
  text?: string;
}

const Loader = ({ icon = true, text }: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      {icon && (
        <div className="w-12 aspect-square flex items-center justify-center">
          <span className="loader"></span>
        </div>
      )}
      <p className="font-semibold text-primary-800">{text || "Cargando..."}</p>
    </div>
  );
};

export default Loader;
