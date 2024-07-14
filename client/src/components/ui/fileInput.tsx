import Placeholder from "@/assets/placeholder.jpg";
import { useEffect, useId, useState } from "react";
import ControlButton from "./table/controlButton";
import Icon from "../icons/icon";

interface Props {
  defaultSrc?: string;
  state: [null | File, React.Dispatch<React.SetStateAction<File | null>>];
}

const FileInput = ({ defaultSrc, state }: Props) => {
  const [value, setValue] = state;
  const [preview, setPreview] = useState<null | string>(null);
  const id = useId();

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setValue(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (value) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(value);
      fileReader.addEventListener("load", () => {
        setPreview(fileReader.result as string);
      });
    }
  }, [value]);

  const selectInput = () => {
    const input = document.getElementById(id);
    input?.click();
  };

  return (
    <div className="flex gap-4">
      <img
        className="aspect-square w-[100px] object-cover rounded-xl border border-gray-300 bg-center bg-cover"
        style={{
          backgroundImage: `url(${Placeholder})`,
        }}
        src={preview || defaultSrc}
      />
      <div className="self-end h-fit">
        <ControlButton
          text="Cambiar"
          type="button"
          icon={<Icon type="photoadd" />}
          onClick={selectInput}
        />
      </div>
      <input className="hidden" id={id} type="file" onChange={changeFile} />
    </div>
  );
};

export default FileInput;
