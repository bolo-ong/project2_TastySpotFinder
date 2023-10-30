import styled from "@emotion/styled";
import { theme } from "styles/theme";
import React, { useState, useRef } from "react";
import { useEscape } from "hooks";

export const DropdownMenu = ({ DropdownButton, children, ...rest }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  //useEscape hook을 이용해서 esc키를 누르거나, 박스 외부 클릭 시 닫힘
  useEscape(() => {
    setIsOpen(false);
  }, ref);

  return (
    <DropdownBox ref={ref} {...rest}>
      {React.cloneElement(DropdownButton, {
        onClick: () => setIsOpen(!isOpen),
      })}
      {isOpen && <DropdownList>{children}</DropdownList>}
    </DropdownBox>
  );
};

export interface Props {
  DropdownButton: React.ReactElement;
  children: React.ReactNode;
}

const DropdownBox = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DropdownList = styled.ul`
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
