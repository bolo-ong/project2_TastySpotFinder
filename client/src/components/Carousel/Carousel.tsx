import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { useState } from "react";
import { Text, Image } from "components";

export interface Props {
  children: React.ReactNode;
  carouselItem: Object[][];
  handleFetchNextPage: () => void;
  hasNextPage: boolean;
  title: string;
}

export const Carousel = ({
  children,
  handleFetchNextPage,
  carouselItem,
  hasNextPage,
  title,
  ...rest
}: Props) => {
  const [translateX, setTranslateX] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentPageItem: Object[] = carouselItem[currentPage - 1];
  const nextSlidCount: number = currentPage === 1 ? 4 : currentPageItem?.length;
  const prevSlidCount: number =
    currentPage === 2 ? 4 : carouselItem[currentPage - 2]?.length;
  const lastPage: number = carouselItem.length + 1 || 2;

  //다음 슬라이드를 기다리지 않도록 처음에 2개의 페이지를 받아오기 때문에 초기에 LastPage가 currentPage보다 1 높음
  const nextPage = () => {
    if (lastPage - 1 === currentPage) {
      handleFetchNextPage();
      setCurrentPage(currentPage + 1);
      setTranslateX(translateX + nextSlidCount * 25);
    } else if (lastPage > currentPage) {
      setCurrentPage(currentPage + 1);
      setTranslateX(translateX + nextSlidCount * 25);
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
    translateX < 100
      ? setTranslateX(0)
      : setTranslateX(translateX - prevSlidCount * 25);
  };

  return (
    <Container>
      <ImageWrapper>
        {currentPage !== 1 && (
          <Image
            name="icon_arrow_left"
            extension="svg"
            width={36}
            height={36}
            onClick={prevPage}
            hoverable
          />
        )}
      </ImageWrapper>

      <CarouselWithTextContainer>
        <TextContainer>
          <Text size={18} weight={800}>
            {title}
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

      <ImageWrapper>
        {(hasNextPage || Boolean(nextSlidCount)) && (
          <Image
            name="icon_arrow_right"
            extension="svg"
            width={36}
            height={36}
            onClick={nextPage}
            hoverable
          />
        )}
      </ImageWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CarouselWithTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 68.75rem;
  gap: 1.25rem;
  margin: 0 0.5rem 0 1.75rem;
  padding-bottom: 3.125rem;
  border-bottom: 0.125rem solid ${theme.colors.gray};
`;

const TextContainer = styled.div`
  width: 67.5rem;
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
    margin-right: 1.25rem;
  }
`;

const ImageWrapper = styled.div`
  width: 2.25rem;
  height: 2.25rem;
`;
