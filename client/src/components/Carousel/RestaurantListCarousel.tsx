import { Carousel } from "components";
import { useGetRestaurantListQuery } from "queries";
import { RestaurantList } from "types";

export const RestaurantListCarousel = () => {
  const { data, fetchNextPage } = useGetRestaurantListQuery();
  const restaurantLists: RestaurantList[][] = data?.pages || [];

  return (
    <Carousel
      restaurantLists={restaurantLists}
      handleFetchNextPage={fetchNextPage}
    />
  );
};
