import { Theme } from "@emotion/react";

export const theme: Theme = {
  //color: [50,100,200,300,400,500,600,700,800,900]
  colors: {
    white: "#fcfcfc",
    pureWhite: "#ffffff",
    black: "#333333",
    main: [
      "#F2EDEA",
      "#D5C6BE",
      "#C1AB9F",
      "#A58473",
      "#946D58",
      "#79482E", //main
      "#6E422A",
      "#563321",
      "#432819",
      "#331E13",
    ],
    success: [
      "#E8F8ED",
      "#B7EBC8",
      "#94E1AE",
      "#64D389",
      "#45CA72",
      "#17BD4F",
      "#15AC48",
      "#108638",
      "#0D682B",
      "#0A4F21",
    ],
    info: [
      "#EAF1FC",
      "#BED3F7",
      "#9FBEF3",
      "#73A1EE",
      "#588EEA",
      "#2E72E5",
      "#2A68D0",
      "#2151A3",
      "#193F7E",
      "#133060",
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
      "#939292", //placeholder
      "#737272",
      "#595858",
      "#444343",
    ],
  },
  pxToRem: (px: number | string) => {
    // px가 문자열일때 처리
    if (typeof px === "string") {
      const numericPx = parseFloat(px);
      return `${numericPx / 16}rem`;
    } else {
      return `${px / 16}rem`;
    }
  },
};
