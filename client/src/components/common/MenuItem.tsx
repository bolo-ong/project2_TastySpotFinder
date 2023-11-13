import styled from "@emotion/styled";
import { theme } from "styles/theme";
import React from "react";

export const MenuItem = ({ handleClick, children, ...rest }: Props) => {
  return (
    <StyledMenuItem onClick={handleClick} {...rest}>
      {children}
    </StyledMenuItem>
  );
};

export interface Props {
  handleClick?: () => void;
  children?: React.ReactNode;
}

const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 2.25rem;

  gap: 0.5rem;
  padding: 0.5rem;

  border-radius: 0.5rem;

  &:hover {
    background-color: ${theme.colors.main};
  }
`;
