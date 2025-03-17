import styled from "@emotion/styled";
import { useIntersect } from "hooks";

export interface Props {
  hasNextPage?: boolean;
  isFetching: boolean;
  handleFetchNextPage: () => void;
  children: React.ReactNode;
}

export const InfinityScroll = ({
  hasNextPage,
  isFetching,
  handleFetchNextPage,
  children,
}: Props) => {
  const options = {
    rootMargin: "300px 0px",
    threshold: 0,
  };

  const ref = useIntersect((entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      handleFetchNextPage();
    }
  }, options);

  return (
    <>
      <Container>{children}</Container>
      <Target ref={ref} />
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1.25rem;
`;

const Target = styled.div`
  height: 0.0625rem;
`;
