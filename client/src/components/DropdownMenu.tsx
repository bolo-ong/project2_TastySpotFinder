import styled from "@emotion/styled";
import React from "react";
import { DropdownList } from "./common/DropdownList";
import { useRecoilState } from "recoil";
import { isOpenDropDownState } from "recoil/atoms";

export const DropdownMenu = ({ DropdownButton, children, ...rest }: Props) => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenDropDownState);

  return (
    <>
      <DropdownBox {...rest}>
        {React.cloneElement(DropdownButton, {
          onClick: () => setIsOpen(!isOpen),
        })}
        {isOpen && <DropdownList>{children}</DropdownList>}
      </DropdownBox>
    </>
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
