import styled from "@emotion/styled";
import { Text, Image } from "components";
import { theme } from "styles/theme";
import { useState } from "react";
import { useToast } from "hooks";

export interface Props {
  children: React.ReactNode;
  handleFetchNextPage: () => void;
  lastPage: number;
  currentPage: number;
  currentPageItem: [];
  setCurrentPage: (num: number) => void;
}

export const Carousel = ({
  children,
  handleFetchNextPage,
  lastPage,
  currentPage,
  currentPageItem,
  setCurrentPage,
  ...rest
}: Props) => {
  const { showToast } = useToast();
  const [translateX, setTranslateX] = useState<number>(0);

  const nextPage = () => {
    if (lastPage >= currentPage) {
      handleFetchNextPage();
      setCurrentPage(currentPage + 1);

      currentPage === 1
        ? setTranslateX(100)
        : setTranslateX(translateX + currentPageItem.length * 25);
    } else {
      showToast("마지막 목록입니다.", "info");
    }
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      translateX < 100 ? setTranslateX(0) : setTranslateX(translateX - 100);
    }
  };

  return (
    <Container>
      <Image
        name="icon_arrow_left"
        extension="svg"
        width={36}
        height={36}
        onClick={previousPage}
        hoverable
      />
      <CarouselWithTextContainer>
        <TextContainer>
          <Text size={18} weight={800}>
            맛집 리스트
          </Text>
          <Text size={16} weight={600} color={theme.colors.main[5]} hoverable>
            더보기
          </Text>
        </TextContainer>
        <CarouselContainer>
          <Wrapper style={{ transform: `translateX(-${translateX}%)` }}>
            {children}
          </Wrapper>
        </CarouselContainer>
      </CarouselWithTextContainer>
      <Image
        name="icon_arrow_right"
        extension="svg"
        width={36}
        height={36}
        onClick={nextPage}
        hoverable
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
`;

const CarouselWithTextContainer = styled.div`
  display: flex;
  width: 67.5rem;
  flex-direction: column;
  gap: 1.25rem;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CarouselContainer = styled.div`
  overflow: hidden;
`;

const Wrapper = styled.ul`
  display: flex;
  transition: transform 0.5s ease-in-out;

  & > * {
    margin-left: 1.25rem;
  }
  & > :nth-of-type(4n + 1) {
    margin-left: 0;
  }
`;
