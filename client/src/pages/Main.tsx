import styled from "@emotion/styled";
import { Navbar, Text, SearchBar } from "components";
import { useGetWeatherData } from "hooks";

export const Main = () => {
  const { temperature, condition } = useGetWeatherData();
  console.log(temperature);
  console.log(condition);
  return (
    <>
      <Container>
        <Navbar />
        <Wrapper>
          <Text size={32} weight={600}>
            오늘은 뭐먹지?
          </Text>
        </Wrapper>
        <SearchBar />
      </Container>
    </>
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
`;
