import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { useGetRestaurantsQuery, useGetLocationQuery } from "queries";
import { Restaurant, MenuItem } from "types";
import {
  Card,
  Dropdown,
  Menu,
  InfinityScroll,
  CardSkeleton,
  DeferredComponent,
} from "components";
import { theme } from "styles";

export const InfinityScrollRestaurants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams();
  const { coordinates, permissionState } = useGetLocationQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [selectedMenu, setSelectedMenu] = useState(
    () => searchParams.get("filter") || undefined
  );
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetRestaurantsQuery(
    "restaurant",
    selectedMenu,
    searchTerm,
    coordinates
  );
  const restaurants: Restaurant[][] = data?.pages || [];
  const isEmpty =
    !restaurants || restaurants.every((page) => page.length === 0);

  const handleCardClick = (_id?: string) => {
    navigate(`/detail/restaurant/${_id}`);
  };

  const handleFilter = (menuItem: MenuItem) => {
    if (menuItem.title === selectedMenu) return;

    setSelectedMenu(menuItem.title);

    params.set("filter", menuItem.title);
    searchTerm && params.set("search", searchTerm);

    setSearchParams(params);
  };

  const menuItems: MenuItem[] = [
    ...(coordinates && !coordinates.isInitialLocation
      ? [{ title: "가까운순" }]
      : []),
    { title: "최신순" },
    { title: "찜 많은순" },
    { title: "추천 많은순" },
    { title: "리뷰 많은순" },
  ];

  // 유저의 위치정보 제공을 고려한, 초기 필터설정
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

    // 위치정보를 받아오는 중이면 종료
    if (!permissionState) return;

    const filter = searchParams.get("filter");

    if (filter) {
      // "가까운순" 필터가 선택되어 있지만 실제 위치 정보가 없는 경우
      if (
        filter === "가까운순" &&
        (!coordinates || coordinates.isInitialLocation)
      ) {
        setSelectedMenu("최신순");
        params.set("filter", "최신순");
        searchTerm && params.set("search", searchTerm);
        setSearchParams(params, { replace: true });
        return;
      }
      setSelectedMenu(filter);
      setSearchTerm(searchParams.get("search") || "");
    } else if (coordinates && !coordinates.isInitialLocation) {
      setSelectedMenu("가까운순");
      params.set("filter", "가까운순");
      searchTerm && params.set("search", searchTerm);
      setSearchParams(params, { replace: true });
    } else {
      params.set("filter", "최신순");
      searchTerm && params.set("search", searchTerm);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, permissionState, coordinates, location]);

  if (!(status === "loading") && isEmpty)
    return <EmptyMessage>'{searchTerm}' 에 관련된 맛집이 없어요</EmptyMessage>;
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
              {restaurants.map((page: Restaurant[]) =>
                page.map((restaurant: Restaurant) => (
                  <Wrapper key={restaurant._id}>
                    {restaurant.distance && (
                      <DistanceBadge>
                        <DistanceIndicator distance={restaurant.distance} />
                        {restaurant.distance}
                      </DistanceBadge>
                    )}
                    <Card
                      onClick={() => handleCardClick(restaurant._id)}
                      title={restaurant.name}
                      content={restaurant.location}
                      src={restaurant.img[0]}
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
  position: relative;
  margin-bottom: 2.5rem;
`;

const InfinityScrollWrapper = styled.div`
  width: 67.5rem;
  margin: 0 auto;
`;

const DistanceBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.white};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DistanceIndicator = styled.span<{ distance: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ distance }) => {
    const km = parseFloat(distance.replace(" km", ""));
    if (km <= 5) return "#11da11";
    if (km <= 10) return "#ffe900";
    return "#ff4040";
  }};
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  font-size: 1.25rem;
  color: ${theme.colors.gray[6]};
`;
