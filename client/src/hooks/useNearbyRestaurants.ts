import { useState, useEffect } from "react";
import { getNearbyRestaurants } from "apis/restaurantAPI";
import { Restaurant } from "types";

// 파라미터로 받은 식당의 주변 3km 식당을 같이 가져옴
export const useNearbyRestaurants = (
  restaurantDetail: Restaurant | undefined
) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<
    Restaurant[] | null
  >(null);

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      if (restaurantDetail) {
        try {
          const [longitude, latitude] =
            restaurantDetail.locationCoordinates.coordinates;
          const data = await getNearbyRestaurants(longitude, latitude, 3);

          // restaurantDetail과 id가 같은 데이터를 첫 번째로 이동
          const mainRestaurant = data.find(
            (restaurant: Restaurant) => restaurant._id === restaurantDetail._id
          );
          const otherRestaurants = data.filter(
            (restaurant: Restaurant) => restaurant._id !== restaurantDetail._id
          );

          const sortedData = mainRestaurant
            ? [mainRestaurant, ...otherRestaurants]
            : otherRestaurants;

          setNearbyRestaurants(sortedData);
        } catch (error) {
          console.error("Error fetching nearby restaurants:", error);
        }
      }
    };

    fetchNearbyRestaurants();
  }, [restaurantDetail]);

  return nearbyRestaurants;
};
