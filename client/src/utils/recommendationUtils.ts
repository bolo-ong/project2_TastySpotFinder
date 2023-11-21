import { recommendationFoods } from "constants/recommendationFoods";

/**
 * 날씨와 온도에 따라 추천 음식을 반환
 * @param {string} temperature - 현재 온도를 나타내는 문자열
 * @param {string} condition - 현재 날씨 상태를 나타내는 문자열
 * @returns {string} 추천 음식
 */
export const getRecommendationFoods = (
  temperature: string,
  condition: string
) => {
  // 음식배열을 파라미터로 받고 랜덤한 음식을 선택하는 함수
  const getRandomFood = (foods: string[]) =>
    foods[Math.floor(Math.random() * foods.length)];

  // 비가 오는 경우, recommendationFoods.rain에서 랜덤한 음식을 반환
  if (condition === "rain") {
    return getRandomFood(recommendationFoods.rain);
  }

  //recommendationFoods의 키값인 온도와, 파라미터로 받아온 temperature를 find메서드로 비교한 후 키값 생성
  const tempKeys = Object.keys(recommendationFoods);
  const tempKey =
    tempKeys.find((key) => parseInt(temperature) <= parseInt(key)) ?? "25";
  const recommendationFoodArray = recommendationFoods[tempKey];

  return getRandomFood(recommendationFoodArray);
};
