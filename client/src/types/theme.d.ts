import { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      white: string;
      pureWhite: string;
      black: string;
      main: string[];
      success: string[];
      info: string[];
      warning: string[];
      gray: string[];
    };
    pxToRem: (px: number | string) => string;
  }
}
