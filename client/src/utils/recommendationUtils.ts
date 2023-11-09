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

  const tempKeys = Object.keys(recommendationFoods);
  const tempKey =
    tempKeys.find((key) => parseInt(temperature) < parseInt(key)) ?? "25";
  const recommendationFood = recommendationFoods[tempKey];

  return getRandomFood(recommendationFood);
};
