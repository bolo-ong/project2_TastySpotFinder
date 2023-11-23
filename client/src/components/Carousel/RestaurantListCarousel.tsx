import { Card, Carousel } from "components";
import { useGetRestaurantListQuery } from "queries";
import { RestaurantList } from "types";

export const RestaurantListCarousel = () => {
  const { data, fetchNextPage } = useGetRestaurantListQuery();
  const restaurantLists: RestaurantList[][] = data?.pages || [];

  return (
    <Carousel
      carouselItem={restaurantLists}
      handleFetchNextPage={fetchNextPage}
      title="맛집 리스트"
    >
      {restaurantLists &&
        restaurantLists.map((page) =>
          page.map((restaurantList: RestaurantList) => (
            <Card
              key={restaurantList._id}
              title={restaurantList.title}
              content={restaurantList.description}
              src={restaurantList.thumbnail}
            />
          ))
        )}
    </Carousel>
  );
};
