import React from "react";
import styled from "@emotion/styled";
import { Text, VerticalCard } from "components";
import { Restaurant } from "types";

interface Props {
  nearbyRestaurants: Restaurant[];
}

export const NearbyRestaurantsSection = ({ nearbyRestaurants }: Props) => (
  <NearbyRestaurantsContainer>
    <Text weight={500}>주변 추천 맛집</Text>
    <VerticalCardContainer>
      {nearbyRestaurants.map((restaurant: Restaurant, index: number) => (
        <VerticalCard key={index} index={index} restaurant={restaurant} />
      ))}
    </VerticalCardContainer>
  </NearbyRestaurantsContainer>
);

const NearbyRestaurantsContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const VerticalCardContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow: scroll;
`;
