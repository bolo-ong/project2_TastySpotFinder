import styled from "@emotion/styled";

interface Props {
  bgColor?: string;
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  width?: string | number;
  height?: string | number;
  borderColor?: string;
  rounded?: boolean;
}

export const Button = styled.button<Props>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${({ fontSize, theme }) =>
    fontSize ? theme.pxToRem(parseInt(`${fontSize}`)) : "1rem"};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color, theme }) => (color ? `${color}` : theme.colors.black)};

  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};
  background-color: ${({ bgColor, theme }) =>
    bgColor ? `${bgColor}` : theme.colors.main};
  border-radius: ${({ rounded }) => (rounded ? "100%" : "0.25rem")};
  border: ${({ borderColor }) =>
    borderColor ? `0.0625rem solid ${borderColor}` : "none"};

  &:hover:not(:disabled) {
    transition: 0.2s ease-in-out;
    filter: brightness(0.9);
  }
  &:disabled {
    cursor: auto;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;
