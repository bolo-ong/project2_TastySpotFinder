import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

//theme provider위치 확인, 타입 지정 확인, remcal만들어서 rem으로 치횐, ... 호버 이벤트쪽 로직 수정
interface Props {
  size?: string | number;
  weight?: string | number;
  color?: string;
  hoverable?: boolean;
}

const getLightColor = (color: string | undefined) => {
  switch (color) {
    case theme.colors.main:
      return theme.colors.mainLight;
    case "black":
      return theme.colors.blackLight;
    default:
      return theme.colors.blackLight;
  }
};

export const Text = styled.span<Props>`
  font-size: ${({ size }) => (size ? `${size}` : `16px`)};
  font-weight: ${({ weight }) => weight || ""};
  color: ${({ color, theme }) => (color ? `${color}` : theme.colors.black)};

  ${({ hoverable, color, theme }) =>
    hoverable &&
    `
    &:hover {
        color: ${color ? getLightColor(color) : theme.colors.blackLight};
    }
  `}
`;
