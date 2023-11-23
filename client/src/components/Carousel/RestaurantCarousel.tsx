import { Card, Carousel } from "components";
import { useGetRestaurantQuery } from "queries";
import { Restaurant } from "types";

export const RestaurantCarousel = () => {
  const { data, fetchNextPage } = useGetRestaurantQuery();
  const restaurants: Restaurant[][] = data?.pages || [];

  return (
    <Carousel
      carouselItem={restaurants}
      handleFetchNextPage={fetchNextPage}
      title="맛집"
    >
      {restaurants &&
        restaurants.map((page) =>
          page.map((restaurantList: Restaurant) => (
            <Card
              key={restaurantList._id}
              title={restaurantList.name}
              content={restaurantList.location}
              src={restaurantList.img[0]}
            />
          ))
        )}
    </Carousel>
  );
};
