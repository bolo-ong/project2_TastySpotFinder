import styled from "@emotion/styled";
import { theme } from "styles/theme";

export const Button = ({
  variant = "filled",
  size = "md",
  children,
  startIcon,
  endIcon,
}: Props) => {
  return (
    <StyledButton size={size} variant={variant}>
      {startIcon}
      {children}
      {endIcon}
    </StyledButton>
  );
};

interface Props {
  variant: "filled" | "outlined" | "warning";
  size: "lg" | "md" | "sm";
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const variants = {
  filled: {
    color: theme.colors.white,
    backgroundColor: theme.colors.main,
  },
  outlined: {
    color: theme.colors.main,
    backgroundColor: theme.colors.white,
  },
  warning: {
    color: theme.colors.white,
    backgroundColor: theme.colors.warning,
  },
};

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

const StyledButton = styled.button<Props>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 0.5rem;
  padding: 0 1rem;
  font-weight: 500;
  border-radius: 12px;

  font-size: ${({ size }) => sizes[size].fontSize};
  height: ${({ size }) => sizes[size].height};

  /* border */
  color: ${({ variant }) => variants[variant].color};
  background-color: ${({ variant }) => variants[variant].backgroundColor};

  > svg {
    width: ${({ size }) => sizes[size].fontSize};
    height: ${({ size }) => sizes[size].fontSize};
    fill: ${({ variant }) => variants[variant].color};
  }

  &:hover:not(:disabled) {
  }

  &:focus:not(:disabled) {
  }
  &:active:not(:disabled) {
  }

  &:disabled {
  }
`;
