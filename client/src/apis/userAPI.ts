import axios from "apis";

export const patchLikeRestaurant = async (
  type: "restaurant" | "restaurantList",
  id: string
) => {
  try {
    const res = await axios.patch(
      `/api/user/patchLike${type}`,
      { id },
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

export const deleteUserProfile = async () => {
  try {
    const res = await axios.delete("/api/user/profile", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
