import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Text } from "components";
import { theme } from "styles/theme";

export const Card = ({ title, content, src }: Props) => {
  return (
    <Container to="">
      <ImageWrapper>
        {Array.isArray(src) ? (
          <StyledImgContainer>
            {src.map((image, index) => (
              <StyledImg key={index} src={image} />
            ))}
          </StyledImgContainer>
        ) : (
          <StyledImg src={src} />
        )}
      </ImageWrapper>
      <TextContainer>
        <Text weight={600}>{title}</Text>
        <Text size={14}>{content}</Text>
      </TextContainer>
    </Container>
  );
};

export interface Props {
  title: string;
  content: string;
  src?: string | string[];
}

const Container = styled(Link)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    & > div > img {
      transform: scale(1.1);
    }
    & > div > span {
      color: ${theme.colors.gray[6]};
    }
  }
`;

const ImageWrapper = styled.div`
  border-radius: 0.75rem;
  width: 15.9375rem;
  height: 15.9375rem;
  overflow: hidden;
`;

const StyledImgContainer = styled.div`
  object-fit: cover;
  overflow: hidden;

  width: 15.9375rem;
  height: 15.9375rem;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50%, auto));
  grid-template-rows: repeat(auto-fill, minmax(50%, auto));

  & > img {
    &:hover {
      border-radius: 0.75rem;
      position: absolute;
      width: 15.9375rem;
      height: 15.9375rem;
    }
  }
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.25rem;
  gap: 0.5rem;
`;
