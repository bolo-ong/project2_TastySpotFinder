import styled from "@emotion/styled";
import { PostingForm } from "components/PostingForm";

export const Posting = () => {
  return (
    <Container>
      <FormContainer>
        <PostingForm />
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

const FormContainer = styled.div`
  min-width: 20rem;
  padding: 2.5rem 1.25rem;
  box-shadow: 0px 2px 10px rgba(63, 71, 77, 0.25);
`;
