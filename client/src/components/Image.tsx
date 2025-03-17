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

export const Image = ({
  width,
  height,
  name,
  extension,
  onClick,
  hoverable,
  ...rest
}: Props) => {
  return (
    <ImageWrapper
      width={width}
      height={height}
      onClick={onClick}
      hoverable={hoverable}
      {...rest}
    >
      <StyledImage
        src={require(`assets/images/${name}.${extension}`)}
        alt={name}
        width={width}
        height={height}
      />
    </ImageWrapper>
  );
};

type ImageWrapperProps = Pick<Props, "width" | "height" | "hoverable"> & {
  onClick?: () => void;
};
const ImageWrapper = styled.div<ImageWrapperProps>`
  display: flex;
  position: relative;
  width: ${({ width, theme }) => (width ? theme.pxToRem(`${width}`) : "100%")};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(`${height}`) : "100%"};

  ${({ hoverable }) =>
    hoverable &&
    `
    &:hover::after {
      pointer-events: none;
      content: "";
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

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
    `}
`;

type StyledImageProps = Pick<Props, "width" | "height">;
const StyledImage = styled.img<StyledImageProps>`
  width: ${({ width, theme }) => (width ? theme.pxToRem(`${width}`) : "100%")};
  height: ${({ height, theme }) =>
    height ? theme.pxToRem(`${height}`) : "100%"};
`;
