import React from "react";
import styled from "@emotion/styled";
import { Text, VerticalCard } from "components";
import { Restaurant } from "types";
import { useNaverMap } from "hooks/useNaverMap";

interface Props {
  nearbyRestaurants: Restaurant[];
}

export const NaverMapSection = ({ nearbyRestaurants }: Props) => {
  const containerId = "map";
  const { mapInstance, markers } = useNaverMap({
    containerId,
    data: nearbyRestaurants,
  });

  return (
    <section>
      <NaverMapWrapper>
        <NaverMap id={containerId} />
      </NaverMapWrapper>

      <NearbyRestaurantsContainer>
        <Text weight={500}>주변 추천 맛집</Text>
        <NearbyRestaurantsWrapper>
          <VerticalCardContainer>
            {nearbyRestaurants.map((restaurant: Restaurant, index: number) => (
              <VerticalCard
                key={index}
                index={index}
                restaurant={restaurant}
                mapInstance={mapInstance}
                markers={markers}
              />
            ))}
          </VerticalCardContainer>
        </NearbyRestaurantsWrapper>
      </NearbyRestaurantsContainer>
    </section>
  );
};

const NearbyRestaurantsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;
const NearbyRestaurantsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow: scroll;
`;

const VerticalCardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const NaverMapWrapper = styled.div`
  margin-top: 3.125rem;
`;

const NaverMap = styled.div`
  width: 100%;
  height: 12.5rem;
`;
