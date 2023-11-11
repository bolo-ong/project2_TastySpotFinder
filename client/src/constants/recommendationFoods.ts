export interface RecommendationFoods {
  rain: string[];
  [key: string]: string[];
}

//최대 5글자, 그 이상은 SlotMachine 컴포넌트의 SlotItem의 width수정 필요
export const recommendationFoods: RecommendationFoods = {
  rain: ["김치전", "해물파전", "감자전", "파전", "삼겹살"],
  0: ["떡만두국", "전골", "김치찌개"], // 0도 이하
  10: ["순두부찌개", "짬뽕", "갈비탕", "잔치국수", "부대찌개", "된장찌개"], // 1도 ~ 10도
  25: ["초밥", "햄버거", "피자", "불고기", "치킨"], // 11도 ~ 25도
  100: ["삼계탕", "냉면", "빙수"], // 25도 이상
};
