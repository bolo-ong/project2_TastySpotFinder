import styled from "@emotion/styled";
import { theme } from "styles/theme";

export const Button = ({
  variant,
  size,
  children,
  startIcon,
  endIcon,
  disabled,
}: Props) => {
  return (
    <StyledButton size={size} variant={variant} disabled={disabled}>
      {startIcon}
      {children}
      {endIcon}
    </StyledButton>
  );
};

interface Props {
  variant: "filled" | "warning" | "outlined";
  size: "lg" | "md" | "sm";
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
}

Button.defaultProps = {
  variant: "filled",
  size: "md",
};

const StyledButton = styled.button<Props>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.75rem;

  padding: ${({ variant }) => variants[variant].padding || "0 1rem"};
  border: ${({ variant }) => variants[variant].border};

  font-size: ${({ size }) => sizes[size].fontSize};
  height: ${({ size }) => sizes[size].height};

  color: ${({ variant }) => variants[variant].color};
  background-color: ${({ variant }) => variants[variant].backgroundColor};

  > svg {
    width: ${({ size }) => sizes[size].fontSize};
    height: ${({ size }) => sizes[size].fontSize};
  }

  &:hover:not(:disabled) {
    background-color: ${({ variant }) =>
      variants[variant].hoverBackgroundColor};
    box-shadow: 0 0 0.125rem #202020;
  }

  &:active:not(:disabled) {
    background-color: ${({ variant }) =>
      variants[variant].activeBackgroundColor ||
      variants[variant].backgroundColor};
    padding: 0 0.875rem;
    border: ${({ variant }) => variants[variant].activeBorder};
  }

  &:disabled {
    cursor: auto;
    color: ${({ variant }) => variants[variant].disabledColor};
    background-color: ${({ variant }) =>
      variants[variant].disabledBackgroundColor ||
      variants[variant].backgroundColor};
    border: ${({ variant }) => variants[variant].disabledBorder};
  }
`;

//constants
const sizes = {
  lg: {
    fontSize: "1rem",
    height: "2.75rem",
  },
  md: {
    fontSize: "0.875rem",
    height: "2.5rem",
  },
  sm: {
    fontSize: "0.75rem",
    height: "2.25rem",
  },
};

interface VariantProps {
  //default
  color?: string;
  backgroundColor?: string;
  border?: string;
  padding?: string;
  //hover
  hoverBackgroundColor?: string;
  //active
  activeBorder?: string;
  activeBackgroundColor?: string;
  //disabled
  disabledColor?: string;
  disabledBackgroundColor?: string;
  disabledBorder?: string;
}

const variants: Record<string, VariantProps> = {
  filled: {
    //default
    color: theme.colors.white,
    backgroundColor: theme.colors.main[5],
    //hover
    hoverBackgroundColor: theme.colors.main[7],
    //active
    activeBorder: `0.125rem solid ${theme.colors.main[7]}`,
    //disabled
    disabledColor: theme.colors.gray[5],
    disabledBackgroundColor: theme.colors.gray[1],
  },
  warning: {
    //default
    color: theme.colors.white,
    backgroundColor: theme.colors.warning[5],
    //hover & focus
    hoverBackgroundColor: theme.colors.warning[7],
    //active
    activeBorder: `0.125rem solid ${theme.colors.warning[7]}`,
    //disabled
    disabledColor: theme.colors.warning[1],
    disabledBackgroundColor: theme.colors.warning[0],
  },
  outlined: {
    //default
    color: theme.colors.main[5],
    backgroundColor: theme.colors.white,
    border: `.0625rem solid ${theme.colors.gray[3]}`,
    padding: `0 .9375rem`,
    //hover & focus
    hoverBackgroundColor: theme.colors.main[0],
    //active
    activeBackgroundColor: theme.colors.main[0],
    activeBorder: `0.125rem solid ${theme.colors.main[1]}`,
    //disabled
    disabledColor: theme.colors.gray[4],
    disabledBorder: `.0625rem solid ${theme.colors.gray[1]}`,
  },
};
