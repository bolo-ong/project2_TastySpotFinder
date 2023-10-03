import styled from "@emotion/styled";
import { makeLightColor } from "utils/makeLightColor";

interface Props {
  size?: string | number;
  weight?: string | number;
  color?: string;
  hoverable?: boolean;
}

export const Text = styled.span<Props>`
  font-size: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : theme.pxToRem(16)};
  font-weight: ${({ weight }) => weight || ""};
  color: ${({ color, theme }) => (color ? `${color}` : theme.colors.black)};

  ${({ hoverable, color, theme }) =>
    hoverable &&
    `
    &:hover {
        color: ${
          color ? makeLightColor(color) : makeLightColor(theme.colors.black)
        };
    }
  `}
`;
