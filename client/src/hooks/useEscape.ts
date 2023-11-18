import { useEffect, RefObject } from "react";

/**
 * ESC를 누르거나, 외부 영역 클릭 시 모달이나 팝업 등을 꺼줌
 * @param {() => void} callback - setIsOpen같은 모달이나 팝업을의 상태를 변경시킬 함수
 * @param {RefObject<HTMLElement | null>} ref - 외부 영역 클릭 감지를 위한 RefObject
 */
export const useEscape = (
  callback: () => void,
  ref?: RefObject<HTMLElement | null>
) => {
  // ESC를 누르면 콜백함수 실행
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      callback();
    }
  };

  // 외부 영역 클릭시 콜백함수 실행
  const handleClick = (e: MouseEvent) => {
    if (
      ref &&
      ref.current &&
      ref.current.parentElement &&
      !ref.current.parentElement.contains(e.target as Node)
    ) {
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
  }, []);
};
