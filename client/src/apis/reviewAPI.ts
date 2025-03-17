import axios from "apis";

export const getRestaurantReviews = async (
  type: "restaurant" | "restaurantList",
  page: number,
  id: string,
  userId?: string,
  sortType?: string
) => {
  try {
    const res = await axios.get(
      "/api/review/getInfinityScrollRestaurantReview",
      {
        params: {
          type,
          page,
          id,
          userId,
          sortType,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const postReview = async (data: {
  type: "restaurant" | "restaurantList";
  _id: string;
  content: string;
}) => {
  try {
    const res = await axios.post("/api/review/postReview", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const patchReview = async (data: {
  reviewId: string;
  content: string;
}) => {
  try {
    const res = await axios.patch("/api/review/patchReview", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const res = await axios.delete("/api/review/deleteReview", {
      data: { reviewId },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const patchLikeReview = async (reviewId: string) => {
  try {
    const res = await axios.patch(
      `/api/review/patchLikeReview`,
      { reviewId },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyReviews = async (page: number) => {
  try {
    const response = await axios.get("/api/review/getMyReviews", {
      params: { page },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
