import { Card, Carousel } from "components";
import { useGetRestaurantQuery } from "queries";
import { Restaurant } from "types";

export const RestaurantCarousel = () => {
  const { data, fetchNextPage, hasNextPage } = useGetRestaurantQuery();
  const restaurants: Restaurant[][] = data?.pages || [];

  return (
    <Carousel
      carouselItem={restaurants}
      handleFetchNextPage={fetchNextPage}
      hasNextPage={Boolean(hasNextPage) && true}
      title="맛집"
    >
      {restaurants &&
        restaurants.map((page) =>
          page.map((restaurantList: Restaurant) => (
            <li key={restaurantList._id}>
              <Card
                title={restaurantList.name}
                content={restaurantList.location}
                src={restaurantList.img[0]}
              />
            </li>
          ))
        )}
    </Carousel>
  );
};
