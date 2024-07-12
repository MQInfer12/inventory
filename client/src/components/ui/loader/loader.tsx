import "./loader.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <span className="loader"></span>
      <p className="font-semibold text-primary-800">Cargando...</p>
    </div>
  );
};

export default Loader;
