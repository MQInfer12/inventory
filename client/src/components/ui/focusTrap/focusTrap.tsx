import { twMerge } from "@/utils/twMerge";
import { ElementRef, useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
  children?: React.ReactNode;
  active?: boolean;
  focusOnClose?: Element | null;
  focusOnRender?: boolean;
  full?: boolean;
  fullH?: boolean;
}

const FocusTrap = ({
  children,
  onClose,
  active = true,
  focusOnClose,
  full,
  fullH,
  focusOnRender = true,
}: Props) => {
  const ref = useRef<ElementRef<"div">>(null);
  const lastFocusedElementRef = useRef(focusOnClose || document.activeElement);

  useEffect(() => {
    if (focusOnClose) {
      lastFocusedElementRef.current = focusOnClose;
    }
  }, [focusOnClose]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!ref.current) return;
    const focusableElements = Array.from(
      ref.current.querySelectorAll(
        'a, button:not(.focus-trap-btn), input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) =>
        !(el as HTMLElement).hasAttribute("disabled") &&
        !(el as HTMLElement).hasAttribute("aria-disabled")
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        trapFocus(event);
      }
    },
    [trapFocus]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (lastFocusedElementRef.current) {
        (lastFocusedElementRef.current as HTMLElement).focus();
      }
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (ref.current && focusOnRender) {
      const focusableElements = Array.from(
        ref.current.querySelectorAll(
          'a, button:not(.focus-trap-btn), input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !(el as HTMLElement).hasAttribute("disabled") &&
          !(el as HTMLElement).hasAttribute("aria-disabled")
      );
      if (focusableElements.length > 0) {
        const hasFormInside = focusableElements.find((e) => {
          return Array.of(...e.classList).some((c) => c.startsWith(`form-`));
        }) as HTMLElement | undefined;
        const firstElement =
          hasFormInside || (focusableElements[0] as HTMLElement);
        firstElement.focus();
      }
    }
  }, []);

  return (
    <div
      className={twMerge(full ? "w-full" : "w-fit", fullH ? "h-full" : "h-fit")}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      {active && (
        <button
          tabIndex={-1}
          onClick={onClose}
          className="focus-trap-btn hidden"
        />
      )}
    </div>
  );
};

export default FocusTrap;
