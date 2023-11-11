import { useInterval } from "hooks";
import { getRecommendationFoods } from "utils";
import { recommendationFoods } from "constants/recommendationFoods";
import { useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  temperature: string | null;
  condition: string | null;
}

export const SlotMachine = ({ temperature, condition }: Props) => {
  const [recommendationFood, setRecommendationFood] = useState<string | null>(
    null
  );
  const randomFoodsArray = Object.values(recommendationFoods).flat();
  const [randomFoodIndex, setRandomFoodIndex] = useState(
    Math.floor(Math.random() * randomFoodsArray.length)
  );
  const randomFood = randomFoodsArray[randomFoodIndex];
  const [animationDuration, setAnimationDuration] = useState(0.3);

  useInterval(
    () => {
      setAnimationDuration(animationDuration + 0.03);
      animationDuration >= 0.6 &&
        temperature &&
        condition &&
        setRecommendationFood(getRecommendationFoods(temperature, condition));
      setRandomFoodIndex(
        (prevIndex) => (prevIndex + 1) % randomFoodsArray.length
      );
    },
    !recommendationFood ? animationDuration * 1000 : null
  );

  return (
    <>
      {recommendationFood ? (
        <SlotItem
          key={recommendationFood}
          visible
          animationDuration={animationDuration}
        >
          {recommendationFood}
        </SlotItem>
      ) : (
        <SlotItem
          key={randomFoodIndex}
          spinning
          animationDuration={animationDuration}
        >
          {randomFood}
        </SlotItem>
      )}
    </>
  );
};

const visibleAnimation = keyframes`
0%{
    transform: translateY(100%) scale(0.6);
    opacity: 0;
}
100%{
    transform: translateY(0);
    opacity:1;
}`;

const rotateAnimation = keyframes`
  0% {
    transform: translateY(100%) scale(0.3);
    opacity: 0;
  }
  50% {
    transform: translateY(0);
    opacity: 1; 
  }
  100% {
    transform: translateY(-100%) scale(0.3);
    opacity: 0;
  }
`;

const SlotItem = styled.span<{
  spinning?: boolean;
  animationDuration?: number;
  visible?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 9.375rem;

  animation: ${({ spinning }) => (spinning ? rotateAnimation : "none")}
    ${({ visible }) => (visible ? visibleAnimation : "none")}
    ${({ animationDuration }) =>
      animationDuration ? `${animationDuration + 0.1}s` : "2s"}
    ease-in-out;
`;
