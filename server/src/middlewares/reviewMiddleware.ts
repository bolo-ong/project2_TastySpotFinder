import { Restaurant, RestaurantList, User } from "../models";

export const updateReviewCount = async (doc: any, increment: number) => {
  // 유저의 리뷰 카운트 업데이트
  await User.findByIdAndUpdate(doc.writer, {
    $inc: { reviewCount: increment },
  });

  // 식당 또는 식당 리스트의 리뷰 카운트 업데이트
  if (doc.restaurant) {
    await Restaurant.findByIdAndUpdate(doc.restaurant, {
      $inc: { reviewCount: increment },
    });
  } else if (doc.restaurantList) {
    await RestaurantList.findByIdAndUpdate(doc.restaurantList, {
      $inc: { reviewCount: increment },
    });
  }
};
