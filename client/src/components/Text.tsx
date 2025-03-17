import React from "react";
import styled from "@emotion/styled";
import { makeLightenColor } from "utils/colorUtils";

// 텍스트의 마지막 줄바꿈을 제거하는 함수
const trimTrailingNewlines = (text: string) => {
  if (typeof text !== "string") return text;
  return text.replace(/\n+$/, "");
};

export interface Props {
  size?: string | number;
  weight?: string | number;
  color?: string;
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Text = ({ children, ...props }: Props) => {
  const trimmedChildren = React.Children.map(children, (child) =>
    typeof child === "string" ? trimTrailingNewlines(child) : child
  );

  return <StyledText {...props}>{trimmedChildren}</StyledText>;
};

const StyledText = styled.span<Props>`
  font-size: ${({ size, theme }) => (size ? theme.pxToRem(`${size}`) : "1rem")};
  font-weight: ${({ weight }) => weight};
  color: ${({ color, theme }) => color || theme.colors.black};
  transition: color 0.2s ease-in-out;

  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ hoverable, color, theme }) =>
    hoverable &&
    `
    &:hover {
      cursor:pointer;
      color: ${
        color ? makeLightenColor(color) : makeLightenColor(theme.colors.black)
      }
    }
  `}
`;
