import { useModal } from "./modal/modal";

interface Props {
  width?: string;
  height?: string;
  src: string | undefined;
  alt?: string;
  title: string;
}

const ZoomImage = ({ title, height, width, src, alt }: Props) => {
  const { modal, openModal } = useModal();

  if (!src) {
    return (
      <div
        style={{
          width: width || "auto",
          height: height || "auto",
        }}
        className="rounded-md object-cover border bg-gray-100 border-gray-300"
      />
    );
  }
  return (
    <>
      <img
        src={src}
        alt={alt || src}
        onClick={(e) => {
          e.stopPropagation();
          openModal();
        }}
        className="bg-gray-100 rounded-md object-cover border cursor-pointer border-gray-300"
        style={{
          width: width || "auto",
          height: height || "auto",
        }}
      />
      {modal(title, () => (
        <div className="w-[500px] h-[500px]">
          <img
            src={src}
            alt={alt}
            className="rounded-md object-cover border w-full h-full"
          />
        </div>
      ))}
    </>
  );
};

export default ZoomImage;
