import { atom } from "recoil";

export interface ToastState {
  isOpen: boolean;
  variant?: "success" | "info" | "warning";
  message: string;
}

export const toastState = atom<ToastState>({
  key: "toastState",
  default: {
    isOpen: false,
    variant: "success",
    message: "",
  },
});

export const activeTabState = atom({
  key: "activeTab",
  default: {
    title: "한번에 보기",
  },
});
