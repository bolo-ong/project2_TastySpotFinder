import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { toastState, ToastState } from "recoil/atoms";

export const useToast = () => {
  const [toast, setToast] = useRecoilState(toastState);

  /**
   * @param {string} message - 토스트에 표시될 메시지
   * @param {string} variant - 토스트의 스타일을 설정할 수 있는 변수, "success" | "info" | "warning" | undefined (기본값 "success")
   */
  const showToast = useCallback(
    (message: string, variant: ToastState["variant"] = "success") => {
      setToast({ isOpen: true, variant, message });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast({ isOpen: false, message: "" });
  }, []);

  return { toast, showToast, hideToast };
};
