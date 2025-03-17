import React from "react";
import styled from "@emotion/styled";
import { Skeleton } from "./Skeleton";

export const CardSkeleton = () => {
  return (
    <Container>
      <Skeleton width={255} height={255} variant="rounded" />
      <TextContainer>
        <Skeleton width={140} height={16} />
        <Skeleton width={230} height={14} />
      </TextContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextContainer = styled.div`
  width: 15.9375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.25rem;
`;
