import { useEffect } from "react";

export const useCloseFocusTrap = () => {
  useEffect(() => {
    const closeFocusTrap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const focusButtons = document.querySelectorAll(".focus-trap-btn");
        if (focusButtons.length > 0) {
          const btn = focusButtons[
            focusButtons.length - 1
          ] as HTMLButtonElement;
          btn.click();
        }
      }
    };

    document.addEventListener("keydown", closeFocusTrap);
    return () => {
      document.removeEventListener("keydown", closeFocusTrap);
    };
  }, []);
};
