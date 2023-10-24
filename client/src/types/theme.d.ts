import { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      white: string;
      black: string;
      main: string[];
      warning: string[];
      gray: string[];
    };
    pxToRem: (px: number) => string;
  }
}
