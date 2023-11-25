import { Card, Carousel } from "components";
import { useGetRestaurantListQuery } from "queries";
import { RestaurantList } from "types";

export const RestaurantListCarousel = () => {
  const { data, fetchNextPage, hasNextPage } = useGetRestaurantListQuery();
  const restaurantLists: RestaurantList[][] = data?.pages || [];

  return (
    <Carousel
      carouselItem={restaurantLists}
      handleFetchNextPage={fetchNextPage}
      hasNextPage={Boolean(hasNextPage) && true}
      title="맛집 리스트"
    >
      {restaurantLists &&
        restaurantLists.map((page) =>
          page.map((restaurantList: RestaurantList) => (
            <li key={restaurantList._id}>
              <Card
                title={restaurantList.title}
                content={restaurantList.description}
                src={restaurantList.thumbnail}
              />
            </li>
          ))
        )}
    </Carousel>
  );
};
