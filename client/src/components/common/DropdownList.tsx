import styled from "@emotion/styled";
import { theme } from "styles/theme";
import React, { useRef } from "react";
import { useEscape } from "hooks";
import { useRecoilState } from "recoil";
import { isOpenDropDownState } from "recoil/atoms";

export const DropdownList = ({ children, ...rest }: Props) => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenDropDownState);
  const ref = useRef<HTMLUListElement>(null);

  useEscape(() => {
    setIsOpen(false);
  }, ref);

  return (
    <StyledUl ref={ref} {...rest}>
      {children}
    </StyledUl>
  );
};

export interface Props {
  children: React.ReactNode;
}

const StyledUl = styled.ul`
  position: absolute;
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  background-color: ${theme.colors.white};
  box-shadow: 0 0.125rem 0.625rem rgba(63, 71, 77, 0.25);
  width: fit-content;

  > * {
    //DropdownItem style
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    width: 100%;

    &:hover {
      background-color: ${theme.colors.main};
    }
  }
`;
