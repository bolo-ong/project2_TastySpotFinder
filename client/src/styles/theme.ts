import { Theme } from "@emotion/react";

export const theme: Theme = {
  fontSizes: {
    sm: "14px",
    md: "16px",
    lg: "18px",
  },
  colors: {
    white: "#ffffff",
    black: "#333333",
    gray: "#F1F4F5",
    darkgray: "#9b9ea1",
    main: "#79482d",
  },
  pxToRem: (px) => `${px / 16}rem`,
};
//gray: [#F8F9FA,#F1F4F5,#DDE0E2,#C1C4C6,#9B9EA1]
