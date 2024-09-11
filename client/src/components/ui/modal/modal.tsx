import Portal from "./portal";
import FocusTrap from "../focusTrap/focusTrap";
import ControlButton from "../table/controlButton";
import Icon from "@/components/icons/icon";
import { useState } from "react";
import { twMerge } from "@/utils/twMerge";

interface Options {
  padding?: boolean;
  width?: string;
  height?: string;
}

export const useModal = <T,>() => {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const openModal = (item?: T) => {
    if (item) {
      setItem(item);
    } else {
      setItem(null);
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const modal = (
    title: string,
    children: (item: T | null) => React.ReactNode,
    options?: Options
  ) => {
    if (!open) return null;
    return (
      <Portal>
        <FocusTrap onClose={closeModal}>
          <div
            className={`z-[300] w-full h-full fixed inset-0 p-5 flex items-center justify-center isolate animate-[appear_.2s]`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="w-full h-full bg-black/40 fixed top-0 left-0 -z-10 animate-[appear_.3s]"
            />
            <div
              className={twMerge(
                "overflow-y-auto relative bg-bg rounded-lg isolate flex flex-col",
                options?.height && "h-full"
              )}
              style={{
                width: options?.width,
                maxWidth: options?.width ? undefined : "100%",
                height: options?.height,
                maxHeight: options?.height ? undefined : "80%",
              }}
            >
              <header className="w-full flex justify-between sticky top-0 items-center pt-2 px-4 z-10 bg-bg">
                <p className="text-base font-semibold text-primary-700">
                  {title}
                </p>
                <ControlButton icon={<Icon type="x" />} onClick={closeModal} />
              </header>
              <div
                className={twMerge(
                  (options?.padding ?? true) && "py-4 px-4",
                  options?.height && "flex-1 overflow-auto"
                )}
              >
                {children(item)}
              </div>
            </div>
          </div>
        </FocusTrap>
      </Portal>
    );
  };

  return { modal, openModal, closeModal };
};
