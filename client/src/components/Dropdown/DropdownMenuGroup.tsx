import styled from "@emotion/styled";
import React, { useRef } from "react";
import { useEscape } from "hooks";

export const DropdownMenuGroup = ({
  children,
  onCloseDropdown,
  ...rest
}: Props) => {
  const ref = useRef<HTMLUListElement>(null);

  useEscape(() => {
    onCloseDropdown();
  }, ref);

  return (
    <StyledUl ref={ref} {...rest}>
      {children}
    </StyledUl>
  );
};

export interface Props {
  children: React.ReactNode;
  onCloseDropdown: () => void;
}

const StyledUl = styled.ul`
  position: absolute;
  top: 2.5rem;

  width: fit-content;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  text-align: left;

  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.625rem rgba(63, 71, 77, 0.25);
`;
