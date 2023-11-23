import styled from "@emotion/styled";
import { makeLightenColor } from "utils/colorUtils";

export interface Props {
  size?: string | number;
  weight?: string | number;
  color?: string;
  hoverable?: boolean;
}

export const Text = styled.span<Props>`
  font-size: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "1rem"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color, theme }) => color || theme.colors.black};
  transition: color 0.2s ease-in-out;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: keep-all;

  ${({ hoverable, color, theme }) =>
    hoverable &&
    `
    &:hover {
      cursor:pointer;
        color: ${
          color ? makeLightenColor(color) : makeLightenColor(theme.colors.black)
        };
    }
  `};
`;
