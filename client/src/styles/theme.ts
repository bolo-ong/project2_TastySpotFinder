import { Theme } from "@emotion/react";

export const theme: Theme = {
  //color: [50,100,200,300,400,500,600,700,800,900]
  colors: {
    white: "#ffffff",
    black: "#333333",
    main: [
      "#F2EDEA",
      "#D5C6BE",
      "#C1AB9F",
      "#A58473",
      "#946D58",
      "#79482E",
      "#6E422A",
      "#563321",
      "#432819",
      "#331E13",
    ],
    warning: [
      "#FAE6E6",
      "#F1B0B0",
      "#EA8A8A",
      "#E05454",
      "#DA3333",
      "#D10000",
      "#BE0000",
      "#940000",
      "#730000",
      "#580000",
    ],
    gray: [
      "#E9EBF8",
      "#E2E2E2",
      "#D4D3D3",
      "#C1BFBF",
      "#B5B3B3",
      "#A2A0A0",
      "#939292",
      "#737272",
      "#595858",
      "#444343",
    ],
  },
  pxToRem: (px) => `${px / 16}rem`,
};
