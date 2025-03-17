import axios from "apis";

export const postRestaurantList = async (data: string | {}) => {
  try {
    const res = await axios.post("/api/restaurant", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteRestaurantList = async (restaurantListId: string) => {
  try {
    const res = await axios.delete("/api/restaurant/deleteRestaurantList", {
      data: { restaurantListId },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const patchRestaurantList = async (
  id: string,
  data: { title: string; description: string }
) => {
  const response = await axios.patch(
    `/api/restaurant/patchRestaurantList`,
    {
      restaurantListId: id,
      ...data,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const crawlRestaurant = async (
  crawlURL: string,
  restaurantListId: string
) => {
  try {
    const res = await axios.post(
      "/api/restaurant/crawl",
      {
        crawlURL,
        restaurantListId,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getInfinityScrollRestaurants = async (
  type: "restaurant" | "restaurantList",
  page: number,
  sortType?: string,
  coordinates?: { longitude: number; latitude: number } | null,
  searchTerm?: string
) => {
  try {
    const params: any = {
      type,
      page,
      sortType,
      searchTerm,
    };

    if (coordinates) {
      params.longitude = coordinates.longitude;
      params.latitude = coordinates.latitude;
    }

    const res = await axios.get(
      `/api/restaurant/getInfinityScrollRestaurants`,
      {
        params,
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getInfinityScrollSavedRestaurants = async (
  type: "restaurant" | "restaurantList",
  page: number
) => {
  try {
    const params: any = {
      type,
      page,
    };

    const res = await axios.get(
      `/api/restaurant/getInfinityScrollSavedRestaurants`,
      {
        params,
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getInfinityScrollMyRecommended = async (page: number) => {
  try {
    const params: any = {
      page,
    };

    const res = await axios.get(
      `/api/restaurant/getInfinityScrollMyRecommended`,
      {
        params,
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getRestaurant = async (
  type: "restaurant" | "restaurantList",
  id: string
) => {
  try {
    const res = await axios.get("/api/restaurant/getRestaurant", {
      params: { type, id },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getNearbyRestaurants = async (
  longitude: number,
  latitude: number,
  maxDistance: number
) => {
  try {
    const response = await axios.get("/api/restaurant/getNearbyRestaurants", {
      params: {
        longitude,
        latitude,
        maxDistance,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
