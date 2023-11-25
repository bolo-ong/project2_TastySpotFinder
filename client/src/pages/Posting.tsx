import styled from "@emotion/styled";
import { PostingForm } from "components";

export const Posting = () => {
  return (
    <Container>
      <PostingForm />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;
