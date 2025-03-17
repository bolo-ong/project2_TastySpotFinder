import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useShowScrollToTopButton = (debounceDelay: number = 200) => {
  const [showScrollToTopButton, setShowScrollToTopButton] =
    useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    setShowScrollToTopButton(false);

    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setShowScrollToTopButton(currentScrollY > 500);
      }, debounceDelay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [debounceDelay, location]);

  return showScrollToTopButton;
};
