import { useEffect, RefObject } from "react";

export const useEscape = (
  callback: () => void,
  ref?: RefObject<HTMLElement | null>
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      callback();
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (ref && ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    if (ref) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (ref) {
        document.removeEventListener("mousedown", handleClick);
      }
    };
  }, [callback]);
};
