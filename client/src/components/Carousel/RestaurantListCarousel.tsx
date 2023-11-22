import { Card, Carousel } from "components";
import { useGetRestaurantListQuery } from "queries";
import { useState } from "react";
import { RestaurantList } from "types";

export const RestaurantListCarousel = () => {
  const { restaurantLists, fetchNextPage } = useGetRestaurantListQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageItem = restaurantLists?.pages[currentPage - 1];
  const lastPage = restaurantLists?.pages.length || 1;

  return (
    <Carousel
      handleFetchNextPage={fetchNextPage}
      lastPage={lastPage}
      currentPage={currentPage}
      currentPageItem={currentPageItem}
      setCurrentPage={setCurrentPage}
    >
      {restaurantLists &&
        restaurantLists.pages.map((page) =>
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
