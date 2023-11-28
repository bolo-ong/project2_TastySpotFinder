import styled from "@emotion/styled";
import { Navbar, SearchBar } from "components";
import { BoardContainerItem, BoardTab } from "pages/Board";

export const Board = () => {
  return (
    <PageContainer>
      <Header>
        <Navbar />
        <SearchBarWrapper>
          <SearchBar />
        </SearchBarWrapper>
      </Header>
      <BoardTab />
      <Container>
        <BoardContainerItem />
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-width: 83.75rem;
  margin: 0 auto;
`;

const Header = styled.div`
  width: 80rem;
  margin: 1rem auto 0 auto;
`;

const Container = styled.div`
  width: 80rem;
  margin: 6.75rem auto 0 auto;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin: 2.75rem auto;
`;
