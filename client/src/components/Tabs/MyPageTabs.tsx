import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs } from "components";
import { TabItem } from "types";

const tabItems: TabItem[] = [
  { title: "작성글", path: "/my-page/posts" },
  { title: "작성댓글", path: "/my-page/comments" },
  { title: "저장한 리스트", path: "/my-page/saved-restaurant-lists" },
  { title: "저장한 맛집", path: "/my-page/saved-restaurants" },
];

export const MyPageTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTabItem, setSelectedTabItem] = useState<TabItem | undefined>();

  const handleTabClick = (tabItem?: TabItem) => {
    if (tabItem === selectedTabItem) return;
    setSelectedTabItem(tabItem);
    navigate({ pathname: tabItem?.path });
  };

  useEffect(() => {
    const tabItem = tabItems.find(
      (tabItem) => location.pathname === tabItem.path
    );
    setSelectedTabItem(tabItem);
  }, [location.pathname]);

  return (
    <Container>
      <Wrapper>
        <Tabs
          items={tabItems}
          selectedTab={selectedTabItem?.title}
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
`;

const Wrapper = styled.ul`
  width: 67.75rem;
`;
