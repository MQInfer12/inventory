import { useMemo } from "react";
import IconAdd from "./iconAdd";
import IconExcel from "./iconExcel";
import IconList from "./iconList";
import IconPdf from "./iconPdf";
import IconReload from "./iconReload";
import IconSearch from "./iconSearch";
import IconX from "./iconX";
import IconUpDown from "./iconUpDown";
import IconDelete from "./iconDelete";
import IconEdit from "./iconEdit";

type IconType =
  | "add"
  | "x"
  | "reload"
  | "search"
  | "excel"
  | "pdf"
  | "list"
  | "up"
  | "down"
  | "edit"
  | "delete";

interface Props {
  type: IconType;
}

const Icon = ({ type }: Props) => {
  const icons: Record<IconType, JSX.Element> = useMemo(
    () => ({
      add: <IconAdd />,
      excel: <IconExcel />,
      list: <IconList />,
      pdf: <IconPdf />,
      reload: <IconReload />,
      search: <IconSearch />,
      x: <IconX />,
      up: <IconUpDown />,
      down: <IconUpDown down />,
      delete: <IconDelete />,
      edit: <IconEdit />,
    }),
    []
  );
  return icons[type];
};

export default Icon;
