import { useEffect, useRef, useCallback } from "react";

export const useAutoResizeTextArea = (value: string | undefined) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.addEventListener("input", adjustTextareaHeight);
      adjustTextareaHeight(); // 초기 높이 설정
    }

    return () => {
      if (textArea) {
        textArea.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, [adjustTextareaHeight]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  return textAreaRef;
};
