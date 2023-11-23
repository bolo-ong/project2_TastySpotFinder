import styled from "@emotion/styled";
import React, { useState } from "react";
import { DropdownMenuGroup } from "./index";

export interface Props {
  trigger: React.ReactElement;
  children: React.ReactNode;
}

export const DropdownMenu = ({ trigger, children, ...rest }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Container {...rest}>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(!isOpen),
        })}
        {isOpen && (
          <DropdownMenuGroup onCloseDropdown={() => setIsOpen(false)}>
            {children}
          </DropdownMenuGroup>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`;
