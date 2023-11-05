import styled from "@emotion/styled";
import { Navbar } from "../components";

export const Main = () => {
  return (
    <>
      <Container>
        <Navbar />
      </Container>
    </>
  );
};

const Container = styled.div`
  min-width: 83.75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;
