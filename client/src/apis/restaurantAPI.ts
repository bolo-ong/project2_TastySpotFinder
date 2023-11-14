import axios from "apis";

export const postRestaurantList = async (data: string | {}) => {
  try {
    const res = await axios.post("/api/restaurant", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const crawlRestaurant = async (
  crawlURL: string,
  restaurantListId: string
) => {
  try {
    const res = await axios.post("/api/restaurant/crawl", {
      crawlURL,
      restaurantListId,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
