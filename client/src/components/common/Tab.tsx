import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { activeTabState } from "recoil/atoms";
import { theme } from "styles/theme";

export interface Props {
  items: { title: string }[];
}

export const Tab = ({ items, ...rest }: Props) => {
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  const handleTabClick = (title: string) => {
    setActiveTab({ ...activeTab, title });
  };

  return (
    <Wrapper>
      <Container>
        {items.map((item) => (
          <TabItem
            key={item.title}
            onClick={() => handleTabClick(item.title)}
            className={activeTab.title === item.title ? "active" : ""}
          >
            {item.title}
          </TabItem>
        ))}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 3.25rem;

  background-color: #f6f8f9;
  border: 1px solid ${theme.colors.gray};
`;

const Container = styled.ul`
  display: flex;
  flex-direction: row;
  width: 67.75rem;
`;

const TabItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  font-weight: 600;
  height: 3.25rem;

  &.active {
    color: ${theme.colors.main[5]};
    border-top: 1px solid ${theme.colors.gray};
    border-bottom: 1px solid ${theme.colors.main[5]};
  }
`;
