import styled from "@emotion/styled";
import { useGetRestaurantsQuery } from "queries";
import { RestaurantList, MenuItem } from "types";
import {
  Card,
  Dropdown,
  Menu,
  InfinityScroll,
  CardSkeleton,
  DeferredComponent,
} from "components";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { theme } from "styles";

const menuItems: MenuItem[] = [
  { title: "최신순" },
  { title: "찜 많은순" },
  { title: "리뷰 많은순" },
];

export const InfinityScrollRestaurantLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [selectedMenu, setSelectedMenu] = useState(
    () => searchParams.get("filter") || "최신순"
  );
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetRestaurantsQuery("restaurantList", selectedMenu, searchTerm);
  const restaurantLists: RestaurantList[][] = data?.pages || [];
  const isEmpty =
    !restaurantLists || restaurantLists.every((page) => page.length === 0);

  const handleCardClick = (_id?: string) => {
    navigate(`/detail/restaurantList/${_id}`, {
      state: { prevPath: window.location.pathname },
    });
  };

  const handleFilter = (menuItem: MenuItem) => {
    if (menuItem.title === selectedMenu) return;

    setSelectedMenu(menuItem.title);

    params.set("filter", menuItem.title);
    searchTerm && params.set("search", searchTerm);

    setSearchParams(params);
  };

  useEffect(() => {
    // 새로고침이나 직접 URL 입력으로 페이지에 진입할 때만 초기화
    if (location.key === "default") {
      setSearchTerm("");
      setSelectedMenu("최신순");
      const params = new URLSearchParams();
      params.set("filter", "최신순");
      setSearchParams(params, { replace: true });
      return;
    }

    setSearchTerm(searchParams.get("search") || "");
    setSelectedMenu(searchParams.get("filter") || "최신순");
  }, [searchParams, location]);

  if (!(status === "loading") && isEmpty)
    return (
      <EmptyMessage>'{searchTerm}' 에 관련된 리스트가 없어요</EmptyMessage>
    );
  return (
    <>
      <DropdownWrapper>
        <Dropdown
          withArrow
          top={20}
          trigger={<TriggerWrapper>{selectedMenu}</TriggerWrapper>}
        >
          <Menu
            items={menuItems}
            selectedMenu={selectedMenu}
            onClick={handleFilter}
          />
        </Dropdown>
      </DropdownWrapper>

      <InfinityScrollWrapper>
        <InfinityScroll
          handleFetchNextPage={fetchNextPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
        >
          {/*처음 로딩 8개의 스켈레톤*/}
          {status === "loading" ? (
            Array.from({ length: 8 }).map((_, index) => (
              <DeferredComponent key={index}>
                <Wrapper>
                  <CardSkeleton />
                </Wrapper>
              </DeferredComponent>
            ))
          ) : (
            <>
              {restaurantLists.map((page: RestaurantList[]) =>
                page
                  .filter(
                    (restaurantList) =>
                      restaurantList.thumbnail.length > 0 &&
                      !restaurantList.isBlinded
                  )
                  .map((restaurantList: RestaurantList) => (
                    <Wrapper key={restaurantList._id}>
                      <Card
                        onClick={() => handleCardClick(restaurantList._id)}
                        title={restaurantList.title}
                        content={restaurantList.description}
                        src={restaurantList.thumbnail}
                        hoverable
                      />
                    </Wrapper>
                  ))
              )}
              {/*다음 리스트를 받아오는 4개의 스켈레톤*/}
              {isFetchingNextPage &&
                Array.from({ length: 4 }).map((_, index) => (
                  <DeferredComponent key={index}>
                    <Wrapper>
                      <CardSkeleton />
                    </Wrapper>
                  </DeferredComponent>
                ))}
            </>
          )}
        </InfinityScroll>
      </InfinityScrollWrapper>
    </>
  );
};

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;

  width: 67.5rem;
  margin: 0 auto 1.25rem auto;
`;

const TriggerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-weight: 600;
  font-size: 0.875rem;

  padding: 0 0.5rem;
  gap: 0.25rem;
`;

const Wrapper = styled.div`
  margin-bottom: 2.5rem;
`;

const InfinityScrollWrapper = styled.div`
  width: 67.5rem;
  margin: 0 auto;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  font-size: 1.25rem;
  color: ${theme.colors.gray[6]};
`;
