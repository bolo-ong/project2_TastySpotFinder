import { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    fontSizes: {
      sm: string;
      md: string;
      lg: string;
    };
    colors: {
      white: string;
      black: string;
      // gray: string;
      // darkgray: string;
      main: string;
      warning: string;
    };
    pxToRem: (px: number) => string;
  }
}
