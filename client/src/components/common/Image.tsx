import React from "react";
import styled from "@emotion/styled";

interface Props {
  width?: string | number;
  height?: string | number;
  name: string;
  extension: string;
}

export const Image = ({ width, height, name, extension }: Props) => {
  return (
    <Wrapper width={width} height={height}>
      <img
        src={`/images/${name}.${extension}`}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  width?: string | number;
  height?: string | number;
}>`
  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};
`;
