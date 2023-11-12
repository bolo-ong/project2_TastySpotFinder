import styled from "@emotion/styled";

export const Image = ({ width, height, name, extension, ...rest }: Props) => {
  return (
    <ImageWrapper width={width} height={height} {...rest}>
      <StyledImage
        src={require(`assets/images/${name}.${extension}`)}
        alt={name}
      />
    </ImageWrapper>
  );
};

export interface Props {
  name: string;
  extension: string;
  width?: string | number;
  height?: string | number;
  hoverable?: boolean;
  as?: React.ElementType;
  to?: string;
}

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
      border-radius: 100%;
      background-color: #220c0c;
      opacity: 0.2;
    }
    `}
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`;
