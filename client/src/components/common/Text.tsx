import styled from "@emotion/styled";
import { makeLightColor } from "utils/colorUtils";

interface Props {
  size?: string | number;
  weight?: string | number;
  color?: string;
  hoverable?: boolean;
}

export const Text = styled.span<Props>`
  font-size: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "1rem"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color, theme }) => (color ? `${color}` : theme.colors.black)};

  ${({ hoverable, color, theme }) =>
    hoverable &&
    `
    transition: color 0.2s ease-in-out;
    &:hover {
        color: ${
          color ? makeLightColor(color) : makeLightColor(theme.colors.black)
        };
    }
  `}
`;
