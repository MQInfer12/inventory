import Portal from "./portal";
import FocusTrap from "../focusTrap/focusTrap";
import ControlButton from "../table/controlButton";
import Icon from "@/components/icons/icon";
import { useState } from "react";

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
    children: (item: T | null) => React.ReactNode
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
              className="w-full h-full bg-black/30 fixed top-0 left-0 -z-10 animate-[appear_.3s]"
            />
            <div className="max-w-[100%] max-h-[80%] overflow-y-auto relative bg-bg rounded-lg isolate">
              <header className="w-full flex justify-between sticky top-0 items-center pt-2 px-4 z-10 bg-bg">
                <p className="text-base font-semibold text-primary-700">
                  {title}
                </p>
                <ControlButton icon={<Icon type="x" />} onClick={closeModal} />
              </header>
              <div className="py-4 px-4">{children(item)}</div>
            </div>
          </div>
        </FocusTrap>
      </Portal>
    );
  };

  return { modal, openModal, closeModal };
};
