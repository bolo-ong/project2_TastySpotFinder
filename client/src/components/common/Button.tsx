import styled from "@emotion/styled";

interface Props {
  width?: string | number;
  height?: string | number;
  border?: string | number;
  disabled?: boolean;
  rounded?: boolean;
  color: string;
}

export const Button = styled.button<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};
  border: ${({ border, theme }) =>
    border ? `${theme.pxToRem(parseInt(`${border}`))} solid #d3d3d3` : "none"};
  border-radius: ${({ rounded, theme }) =>
    rounded ? theme.pxToRem(100) : theme.pxToRem(4)};
  background-color: ${({ disabled, color, theme }) =>
    disabled ? theme.colors.gray : color};
`;
