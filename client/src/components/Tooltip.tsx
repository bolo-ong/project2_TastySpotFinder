import styled from "@emotion/styled";
import { theme } from "styles/theme";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  onClick?: () => void;
}

export const Tooltip = ({
  content,
  position = "bottom",
  children,
  onClick,
}: TooltipProps) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipContent position={position} onClick={onClick}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover > div {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease-in-out;
  }
`;

const TooltipContent = styled.div<{ position: string }>`
  position: absolute;
  ${({ position }) => getPositionStyles(position)}

  padding: 0.5rem 1rem;
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[9]};
  border: 0.0625rem solid ${theme.colors.main[3]};
  border-radius: 1rem;
  font-size: 0.875rem;
  white-space: nowrap;

  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
  z-index: 1000;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
  }

  &::before {
    ${({ position }) => {
      switch (position) {
        case "top":
          return `
            bottom: -0.5625rem;
            border-left: 0.5625rem solid transparent;
            border-right: 0.5625rem solid transparent;
            border-top: 0.5625rem solid ${theme.colors.main[3]};
          `;
        case "bottom":
          return `
            top: -0.5625rem;
            border-left: 0.5625rem solid transparent;
            border-right: 0.5625rem solid transparent;
            border-bottom: 0.5625rem solid ${theme.colors.main[3]};
          `;
        case "left":
          return `
            right: -0.5625rem;
            top: 50%;
            transform: translateY(-50%);
            border-top: 0.5625rem solid transparent;
            border-bottom: 0.5625rem solid transparent;
            border-left: 0.5625rem solid ${theme.colors.main[3]};
          `;
        case "right":
          return `
            left: -0.5625rem;
            top: 50%;
            transform: translateY(-50%);
            border-top: 0.5625rem solid transparent;
            border-bottom: 0.5625rem solid transparent;
            border-right: 0.5625rem solid ${theme.colors.main[3]};
          `;
        default:
          return "";
      }
    }}
  }

  &::after {
    ${({ position }) => {
      switch (position) {
        case "top":
          return `
            bottom: -0.5rem;
            border-left: 0.5rem solid transparent;
            border-right: 0.5rem solid transparent;
            border-top: 0.5rem solid ${theme.colors.white};
          `;
        case "bottom":
          return `
            top: -0.5rem;
            border-left: 0.5rem solid transparent;
            border-right: 0.5rem solid transparent;
            border-bottom: 0.5rem solid ${theme.colors.white};
          `;
        case "left":
          return `
            right: -0.5rem;
            top: 50%;
            transform: translateY(-50%);
            border-top: 0.5rem solid transparent;
            border-bottom: 0.5rem solid transparent;
            border-left: 0.5rem solid ${theme.colors.white};
          `;
        case "right":
          return `
            left: -0.5rem;
            top: 50%;
            transform: translateY(-50%);
            border-top: 0.5rem solid transparent;
            border-bottom: 0.5rem solid transparent;
            border-right: 0.5rem solid ${theme.colors.white};
          `;
        default:
          return "";
      }
    }}
  }

  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
`;

const getPositionStyles = (position: string) => {
  switch (position) {
    case "top":
      return `
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 0.5rem;
      `;
    case "bottom":
      return `
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.5rem;
      `;
    case "left":
      return `
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 0.5rem;
      `;
    case "right":
      return `
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 0.5rem;
      `;
    default:
      return "";
  }
};
