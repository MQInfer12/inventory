import { createPortal } from "react-dom";

interface Props {
  children?: JSX.Element;
  type?: "portal" | "selector" | "input-error";
}

const Portal = ({ children, type = "portal" }: Props) => {
  return createPortal(
    children,
    document.getElementById(
      type === "portal"
        ? "portals-container"
        : type === "selector"
        ? "selectors-container"
        : "input-errors-container"
    ) || document.body
  );
};

export default Portal;
