import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { theme } from "styles/theme";
import { Tabs } from "components";
import { TabItem } from "types";

const tabItems: TabItem[] = [
  { title: "한번에 보기", path: "/board" },
  { title: "리스트로 보기", path: "/board/restaurantlist" },
  { title: "하나씩 보기", path: "/board/restaurant" },
];

export const BoardTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedTabItem, setSelectedTabItem] = useState<TabItem | undefined>();

  const handleTabClick = (tabItem?: TabItem) => {
    if (tabItem === selectedTabItem) return;

    setSelectedTabItem(tabItem);

    // 기존의 검색어와 필터 유지
    const searchTerm = searchParams.get("search");
    const filter = searchParams.get("filter");

    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);

    // 리스트로 보기로 이동할 때만 '가까운순' 필터를 '최신순'으로 변경
    if (
      filter &&
      tabItem?.path === "/board/restaurantlist" &&
      filter === "가까운순"
    ) {
      params.set("filter", "최신순");
      // 이전 필터 값을 state로 저장
      navigate(
        {
          pathname: tabItem?.path,
          search: params.toString() ? `?${params.toString()}` : "",
        },
        {
          state: { previousFilter: filter },
        }
      );
    } else {
      // 리스트로 보기에서 다른 탭으로 이동할 때, state에서 이전 필터 값을 확인
      const previousFilter = location.state?.previousFilter;
      if (previousFilter && tabItem?.path === "/board/restaurant") {
        params.set("filter", previousFilter);
      } else if (filter) {
        params.set("filter", filter);
      }

      navigate({
        pathname: tabItem?.path,
        search: params.toString() ? `?${params.toString()}` : "",
      });
    }
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

  background-color: #f6f8f9;
  border: 1px solid ${theme.colors.gray};
`;

const Wrapper = styled.ul`
  width: 67.75rem;
`;
