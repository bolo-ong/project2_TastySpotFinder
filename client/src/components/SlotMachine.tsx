import styled from "@emotion/styled";
import { useInterval, useGetWeatherData } from "hooks";
import { getRecommendationFoods } from "utils";
import { recommendationFoods } from "constants/recommendationFoods";
import { useState } from "react";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";

export const SlotMachine = () => {
  const { temperature, condition } = useGetWeatherData();
  const [recommendationFood, setRecommendationFood] = useState<string | null>(
    null
  );
  const randomFoodsArray = Object.values(recommendationFoods).flat();
  const [randomFoodIndex, setRandomFoodIndex] = useState(
    Math.floor(Math.random() * randomFoodsArray.length)
  );
  const randomFood = randomFoodsArray[randomFoodIndex];
  const [animationDuration, setAnimationDuration] = useState(0.3);
  const [isFadeOut, setIsFadeOut] = useState(false);

  useInterval(
    () => {
      //슬롯머신이 점점 느려지게 만들기 위해, 0.03초씩 늦춥니다.
      setAnimationDuration(animationDuration + 0.03);

      //슬롯머신이 10회 동작했다면 추천음식을 가져오는 util함수를 실행시킵니다.
      animationDuration >= 0.6 &&
        temperature &&
        condition &&
        setRecommendationFood(getRecommendationFoods(temperature, condition));

      //슬롯머신이 계속 랜덤한 음식을 보여주게 index를 가변시킵니다.
      setRandomFoodIndex(
        (prevIndex) => (prevIndex + 1) % randomFoodsArray.length
      );
    },
    //추천음식을 받기 전까지 애니메이션 속도가 늦춰짐에 따라 interval카운트를 맞춰줍니다.
    !recommendationFood ? animationDuration * 1000 : null
  );

  useInterval(
    () => {
      //날씨와 온도 데이터를 받아온 후 기존의 텍스트를 fadeout시키고, 새로운 텍스트를 fadein시킵니다.
      temperature && condition && setIsFadeOut(true);
    },
    !isFadeOut ? 1000 : null
  );

  return (
    <Container>
      {isFadeOut && temperature ? (
        <StyledSpan fadeIn>
          {condition === "rain"
            ? "비올땐"
            : parseInt(temperature) < 0
            ? "뜨끈한"
            : parseInt(temperature) <= 10
            ? "따뜻한"
            : parseInt(temperature) <= 25
            ? "무난한"
            : "더울땐"}
        </StyledSpan>
      ) : condition ? (
        <StyledSpan fadeOut>오늘</StyledSpan>
      ) : (
        <StyledSpan>오늘</StyledSpan>
      )}

      {recommendationFood ? (
        <SlotItem
          key={recommendationFood}
          fadeIn
          duration={animationDuration}
          style={{ cursor: "pointer" }}
        >
          <Link to="/">{recommendationFood}</Link>
        </SlotItem>
      ) : (
        <SlotItem key={randomFoodIndex} spinning duration={animationDuration}>
          {randomFood}
        </SlotItem>
      )}
      <span>어때요?</span>
    </Container>
  );
};

const fadeInAnimation = keyframes`
0%{
    transform: translateY(100%) scale(0.3);
    opacity: 0;
}
100%{
    transform: translateY(0);
    opacity:1;
}`;

const fadeOutAnimation = keyframes`
0%{
    transform: translateY(0);
    opacity:1;
}
100%{
    transform: translateY(-100%) scale(0.3);
    opacity: 0;
}
`;

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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 3.125rem;
  font-size: 2rem;
  font-weight: 600;
`;

const SlotItem = styled.span<{
  spinning?: boolean;
  duration?: number;
  fadeIn?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 9.375rem;

  animation: ${({ spinning }) => (spinning ? rotateAnimation : "none")}
    ${({ fadeIn }) => (fadeIn ? fadeInAnimation : "none")}
    ${({ duration }) => (duration ? `${duration}s` : "2s")} ease-in-out;
  animation-fill-mode: forwards;
`;

const StyledSpan = styled.span<{
  fadeOut?: boolean;
  fadeIn?: boolean;
  duration?: number;
}>`
  width: 5.1875rem;
  animation: ${({ fadeOut }) => (fadeOut ? fadeOutAnimation : "none")}
    ${({ fadeIn }) => (fadeIn ? fadeInAnimation : "none")} 1s ease-in-out;
  animation-fill-mode: forwards;
`;
