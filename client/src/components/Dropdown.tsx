import styled from "@emotion/styled";
import React, { useState, useRef } from "react";
import { Image } from "components";
import { theme } from "styles/theme";
import { useEscape } from "hooks";

export interface Props {
  trigger: React.ReactElement;
  children: React.ReactNode;
  top?: string | number;
  withArrow?: boolean;
}

export const Dropdown = ({
  trigger,
  children,
  top,
  withArrow,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Container {...rest}>
      <TriggerWrapper onClick={() => setIsOpen(!isOpen)}>
        {React.cloneElement(trigger)}
        {withArrow && (
          <ImageWrapper isAnimation={isOpen}>
            <Image name={`icon_sort_down`} extension="svg" width={9.75} />
          </ImageWrapper>
        )}
      </TriggerWrapper>
      {isOpen && (
        <DropdownMenu top={top} onCloseDropdown={() => setIsOpen(false)}>
          {children}
        </DropdownMenu>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
`;

const TriggerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  > * {
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div<{ isAnimation: boolean }>`
  transform: ${({ isAnimation }) => (isAnimation ? "rotate(-180deg)" : "none")};
  transition: transform 0.3s ease-in-out;
`;

// Dropdown에 종속된 DropdownMenu 컴포넌트, useEscape와 ref를 DropdownMenu가 오픈됐을때 불러오기 위해 분리
interface DropdownMenuProps {
  children: React.ReactNode;
  onCloseDropdown: () => void;
  top?: string | number;
}

const DropdownMenu = ({
  children,
  onCloseDropdown,
  top,
  ...rest
}: DropdownMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEscape(onCloseDropdown, ref);

  return (
    <DropdownMenuContainer
      top={top}
      ref={ref}
      {...rest}
      onClick={() => onCloseDropdown()}
    >
      {children}
    </DropdownMenuContainer>
  );
};

type DropdownMenuContainerProps = Pick<Props, "top">;
const DropdownMenuContainer = styled.div<DropdownMenuContainerProps>`
  z-index: 2;
  position: absolute;
  min-width: max-content;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;

  padding: 0.5rem 0;
  border-radius: 0.5rem;
  background-color: ${theme.colors.pureWhite};
  box-shadow: 0 0.125rem 0.625rem rgba(63, 71, 77, 0.25);
  top: ${({ top, theme }) => theme.pxToRem(`${top}`)};

  > * {
    cursor: pointer;
  }
`;
