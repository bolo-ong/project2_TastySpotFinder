import styled from "@emotion/styled";

export interface Props {
  name: string;
  extension: string;
  width?: string | number;
  height?: string | number;
  hoverable?: boolean;
  onClick?: () => void;
  as?: React.ElementType;
  to?: string;
}

export const Image = ({ width, height, name, extension, ...rest }: Props) => {
  return (
    <ImageWrapper width={width} height={height} {...rest}>
      <StyledImage
        src={require(`assets/images/${name}.${extension}`)}
        alt={name}
        width={width}
        height={height}
      />
    </ImageWrapper>
  );
};

type ImageWrapperProps = Pick<Props, "width" | "height" | "hoverable">;
const ImageWrapper = styled.div<ImageWrapperProps>`
  position: relative;
  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};

  ${({ hoverable }) =>
    hoverable &&
    `
    &:hover::after {
      content: "";
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #220c0c;
      opacity: 0.2;
    }
    `}
`;

type StyledImageProps = Pick<Props, "width" | "height">;
const StyledImage = styled.img<StyledImageProps>`
  width: ${({ width, theme }) =>
    width ? theme.pxToRem(parseInt(`${width}`)) : "100%"};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(parseInt(`${height}`)) : "100%"};
`;
