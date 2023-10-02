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
      blackLight: string;
      gray: string;
      grayLight: string;
      darkgray: string;
      darkgrayLight: string;
      main: string;
      mainLight: string;
    };
  }
}
