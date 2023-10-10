import React from "react";
import styled from "@emotion/styled";

export const Image = ({ width, height, name, extension }: Props) => {
  return (
    <ImageWrapper width={width} height={height}>
      <StyledImage src={`/images/${name}.${extension}`} alt={name} />
    </ImageWrapper>
  );
};

interface Props {
  name: string;
  extension: string;
  width?: string | number;
  height?: string | number;
}

type ImageWrapperProps = Pick<Props, "width" | "height">;
const ImageWrapper = styled.div<ImageWrapperProps>`
  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
