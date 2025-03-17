import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "styles/theme";
import React from "react";

export interface Props {
  variant?: "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  children?: React.ReactNode;
}

export const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  borderRadius,
  children,
  ...rest
}: Props) => {
  return (
    <StyledSkeleton
      variant={variant}
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...rest}
    >
      {children}
    </StyledSkeleton>
  );
};

const skeletonAnimation = keyframes` 
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }

    100% {
      opacity: 1;
    }
  
`;
const StyledSkeleton = styled.div<Props>`
  background-color: ${theme.colors.gray[1]};
  width: ${({ width }) => (width ? theme.pxToRem(`${width}`) : "fit-content")};
  height: ${({ height }) =>
    height ? theme.pxToRem(`${height}`) : "fit-content"};

  animation: ${skeletonAnimation} 2s ease-in-out 0.5s infinite normal none
    running;

  border-radius: ${({ borderRadius }) =>
    borderRadius ? theme.pxToRem(`${borderRadius}`) : null};

  border-radius: ${({ variant }) => {
    switch (variant) {
      case "circular":
        return "50%";
      case "rounded":
        return "0.75rem";
    }
  }};
`;
