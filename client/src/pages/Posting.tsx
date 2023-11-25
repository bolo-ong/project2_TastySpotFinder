import styled from "@emotion/styled";
import { PostingForm } from "components";

export const Posting = () => {
  return (
    <Container>
      <Wrapper>
        <PostingForm />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

const Wrapper = styled.div`
  min-width: 20rem;
  padding: 2.5rem 1.25rem;
  box-shadow: 0px 2px 10px rgba(63, 71, 77, 0.25);
`;
