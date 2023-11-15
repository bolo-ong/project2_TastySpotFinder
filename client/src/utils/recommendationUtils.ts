import { recommendationFoods } from "constants/recommendationFoods";

export const getRecommendationFoods = (
  temperature: string,
  condition: string
) => {
  const getRandomFood = (foods: string[]) =>
    foods[Math.floor(Math.random() * foods.length)];

  if (condition === "rain") {
    return getRandomFood(recommendationFoods.rain);
  }

  //recommendationFoods의 키값인 온도와, 파라미터로 받아온 temperature를 find메서드로 비교한 후 키값 생성
  const tempKeys = Object.keys(recommendationFoods);
  const tempKey =
    tempKeys.find((key) => parseInt(temperature) < parseInt(key)) ?? "25";
  const recommendationFoodArray = recommendationFoods[tempKey];

  return getRandomFood(recommendationFoodArray);
};
