import { useEffect, useRef } from "react";

export type UseInterval = (callback: () => void, delay: number | null) => void;

/**
 * @param callback - 인터벌마다 호출되는 콜백 함수
 * @param delay - 딜레이 시간, null을 전달하면 디펜던시에 null이 할당되면서 중지
 */
export const useInterval: UseInterval = (callback, delay) => {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
