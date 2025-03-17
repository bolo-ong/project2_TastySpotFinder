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

export const InfinityScrollRestaurantState = atom({
  key: "InfinityScrollRestaurantState",
  default: {
    title: "",
  },
});
