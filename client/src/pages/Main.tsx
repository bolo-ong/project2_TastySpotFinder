import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Navbar, SearchBar, SlotMachine } from "components";
import { theme } from "styles/theme";
import { useGetWeatherData } from "hooks";

export const Main = () => {
  const { temperature, condition } = useGetWeatherData();
  console.log(temperature);
  console.log(condition);

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <span>오늘</span>
        {condition ? (
          <SlotMachine temperature={temperature} condition={condition} />
        ) : (
          <StyledSpan floatAnimation>???</StyledSpan>
        )}
        <span>어때요</span>
      </Wrapper>
      <SearchBar />
    </Container>
  );
};

const Container = styled.div`
  min-width: 83.75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: 11.25rem 0 2.75rem 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 3.125rem;
  font-size: 2rem;
  font-weight: 600;
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledSpan = styled.span<{ floatAnimation: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 9.375rem;
  color: ${theme.colors.main[5]};
  animation: ${floatAnimation} 2s infinite;
`;
