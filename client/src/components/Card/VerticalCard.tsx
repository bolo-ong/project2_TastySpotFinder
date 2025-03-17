import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Text } from "components";
import { Restaurant } from "types";

interface Props {
  index: number;
  restaurant: Restaurant;
  size?: string | number;
  imageHeight?: string | number;
  mapInstance?: naver.maps.Map | null;
  markers?: naver.maps.Marker[];
  onClick?: () => void;
}

export const VerticalCard = ({
  index,
  restaurant,
  size = 400,
  imageHeight = 150,
  mapInstance,
  markers,
  onClick,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // 카드 클릭 시 해당 식당 디테일 페이지로 이동
  const handleCardClick = () => {
    const url = `/detail/restaurant/${restaurant._id}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  useEffect(() => {
    const markerElement = document.querySelector(
      `.custom-marker-${index}`
    ) as HTMLElement;

    if (markerElement) {
      if (isHovered) {
        markerElement.style.zIndex = "1000";
        markerElement.style.backgroundColor = theme.colors.gray[1];
        if (mapInstance && markers) {
          const reversedIndex = markers.length - 1 - index;
          mapInstance.panTo(markers[reversedIndex].getPosition());
        }
      } else {
        markerElement.style.zIndex = "0";
        markerElement.style.backgroundColor = theme.colors.white;
      }
    }
  }, [isHovered, index, markers, mapInstance]);

  return (
    <Container
      size={size}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <TextContainer>
        <Header>
          <Index>{index + 1}</Index>
          <Text weight={500}>{restaurant.name}</Text>
          <Text size={12} color={theme.colors.gray[6]}>
            {restaurant.category}
          </Text>
          <Text size={14} weight={500}>
            {restaurant.count}명<Text size={12}>이 추천했습니다</Text>
          </Text>
        </Header>
        <Text size={14}>{restaurant.location}</Text>
      </TextContainer>
      <ImageContainer>
        {restaurant.img?.map((image, imgIndex) => (
          <CardImage
            key={imgIndex}
            src={image}
            alt={`${restaurant.name} ${imgIndex + 1}`}
            imageHeight={imageHeight}
            singleImage={restaurant.img.length === 1}
          />
        ))}
      </ImageContainer>
    </Container>
  );
};

const Container = styled.div<{ size: string | number }>`
  min-width: ${({ size, theme }) =>
    size ? theme.pxToRem(`${size}`) : `25rem`};
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid ${theme.colors.gray[0]};
  padding: 1rem;
  gap: 1rem;

  &:hover {
    background-color: ${theme.colors.gray[1]};
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  & > :nth-of-type(3) {
    margin-left: auto;
  }
`;

const Index = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  background-color: ${theme.colors.main[5]};
  border-radius: 50%;
  font-size: 0.8125rem;
  color: ${theme.colors.white};
  text-align: center;
  line-height: 1.5rem;
`;

const ImageContainer = styled.div`
  display: flex;
  border-radius: 0.5rem;
`;

interface CardImageProps {
  imageHeight?: string | number;
  singleImage?: boolean;
}

const CardImage = styled.img<CardImageProps>`
  object-fit: cover;
  flex: 1 1 auto;

  width: 0;
  height: ${({ imageHeight, theme }) =>
    imageHeight ? theme.pxToRem(`${imageHeight}`) : `9.375rem`};

  border-right: ${({ singleImage }) =>
    singleImage ? "none" : `0.0625rem solid ${theme.colors.white}`};

  &:first-of-type {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }

  &:last-of-type {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-right: none;
  }
`;
