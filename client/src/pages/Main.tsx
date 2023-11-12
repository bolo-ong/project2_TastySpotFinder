import styled from "@emotion/styled";
import { Navbar, SearchBar, SlotMachine } from "components";

export const Main = () => {
  return (
    <Container>
      <Navbar />
      <Wrapper>
        <SlotMachine />
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
