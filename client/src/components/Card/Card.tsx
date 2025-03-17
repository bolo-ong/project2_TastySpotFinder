import styled from "@emotion/styled";
import { Text, Image } from "components";
import { theme } from "styles/theme";

export interface Props {
  title?: string;
  content?: string;
  src?: string | string[];
  width?: string | number;
  height?: string | number;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({
  title,
  content,
  src,
  width,
  height,
  hoverable,
  onClick,
  ...rest
}: Props) => {
  return (
    <Container hoverable={hoverable} onClick={onClick} {...rest}>
      <ImageWrapper width={width} height={height}>
        {src ? (
          Array.isArray(src) ? (
            <StyledImgContainer
              width={width}
              height={height}
              hoverable={hoverable}
            >
              {src.map((image, index) => (
                <StyledImg key={index} src={image} />
              ))}
            </StyledImgContainer>
          ) : (
            <StyledImg src={src} />
          )
        ) : (
          <DefaultImage>
            <Image name="logo_main" extension="png" width={104} height={104} />
          </DefaultImage>
        )}
      </ImageWrapper>
      {(title || content) && (
        <TextContainer width={width}>
          {title && <Text weight={600}>{title}</Text>}
          {content && <Text size={14}>{content}</Text>}
        </TextContainer>
      )}
    </Container>
  );
};

const Container = styled.div<Props>`
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  pointer-events: ${({ onClick }) => (onClick ? "auto" : "none")};

  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${({ hoverable }) =>
    hoverable &&
    `&:hover {
    & > div > img {
      transform: scale(1.1);
    }
    & > div > span {
      color: ${theme.colors.gray[6]};
    }
  }
  `}
`;

const ImageWrapper = styled.div<Props>`
  background-color: ${theme.colors.gray[2]};
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 0.75rem;
  width: ${({ width }) => (width ? theme.pxToRem(`${width}`) : "15.9375rem")};
  height: ${({ height }) =>
    height ? theme.pxToRem(`${height}`) : "15.9375rem"};
  overflow: hidden;
`;

const StyledImgContainer = styled.div<Props>`
  object-fit: cover;
  overflow: hidden;

  width: ${({ width }) => (width ? theme.pxToRem(`${width}`) : "15.9375rem")};
  height: ${({ height }) =>
    height ? theme.pxToRem(`${height}`) : "15.9375rem"};

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50%, auto));
  grid-template-rows: repeat(auto-fill, minmax(50%, auto));

  ${({ hoverable }) =>
    hoverable &&
    `
  & > img {
    &:hover {
      border-radius: 0.75rem;
      position: absolute;
      width: 15.9375rem;
      height: 15.9375rem;
    }
  }
  `}
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
`;

const TextContainer = styled.div<Props>`
  width: ${({ width }) => (width ? theme.pxToRem(`${width}`) : "15.9375rem")};
  height: 2.375rem;
  display: flex;
  flex-direction: column;
  padding: 0 0.25rem;
  gap: 0.5rem;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DefaultImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: ${theme.colors.gray[2]};
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;
