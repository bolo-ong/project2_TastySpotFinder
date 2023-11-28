import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Tab } from "components";
import { useRecoilState } from "recoil";
import { boardTabState } from "recoil/atoms";

const tabs = [
  { title: "한번에 보기" },
  { title: "리스트로 보기" },
  { title: "하나씩 보기" },
];

export const BoardTab = () => {
  const [selectedTab, setSelectedTab] = useRecoilState(boardTabState);

  const handleTabClick = (title: string) => {
    setSelectedTab({ ...selectedTab, title });
  };

  return (
    <Container>
      <Wrapper>
        <Tab
          items={tabs}
          selectedTab={selectedTab.title}
          onClick={handleTabClick}
        />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 3.25rem;

  background-color: #f6f8f9;
  border: 1px solid ${theme.colors.gray};
`;

const Wrapper = styled.ul`
  width: 67.75rem;
`;
