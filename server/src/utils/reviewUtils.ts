// import { Review, Restaurant } from "../models";

// // 리뷰가 등록될 때, 해당 식당의 평점을 계산해서 저장
// export const updateRestaurantRating = async (
//   restaurantId: string
// ): Promise<void> => {
//   const reviews = await Review.find({ restaurant: restaurantId });
//   const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//   const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

//   await Restaurant.findByIdAndUpdate(restaurantId, { rating: averageRating });
// };
