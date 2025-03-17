import React from "react";
import styled from "@emotion/styled";
import { Skeleton } from "./Skeleton";

export const ReviewSkeleton = () => {
  return (
    <Container>
      <ReviewHeader>
        <Skeleton width={36} height={36} variant="circular" />
        <Skeleton width={170} height={14} />
      </ReviewHeader>
      <ReviewContent>
        <Skeleton width={300} height={14} />
      </ReviewContent>
      <Skeleton width={94} height={36} variant="rounded" />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border-radius: 0.375rem;
  padding: 1rem 0.625rem 0.625rem 1.125rem;
  min-height: 10.625rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const ReviewContent = styled.div`
  margin-bottom: 1.25rem;
  width: 51.875rem;
`;
