import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { ReactComponent as LocationIcon } from "assets/images/icon_location.svg";
import { ReactComponent as SpinnerIcon } from "assets/images/icon_spinner.svg";
import { useGetLocationQuery } from "queries";
import { Tooltip } from "components";
import { useEffect, useState } from "react";

export const LocationSwitch = () => {
  const navigate = useNavigate();
  const { coordinates, permissionState } = useGetLocationQuery();
  const [isRequesting, setIsRequesting] = useState(false);
  const hasActualLocation = coordinates && !coordinates.isInitialLocation;

  // hasActualLocation이 true가 되면 isRequesting을 false로 변경
  useEffect(() => {
    if (hasActualLocation) {
      setIsRequesting(false);
    }
  }, [hasActualLocation, coordinates]);

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      setIsRequesting(true);
      navigator.geolocation.getCurrentPosition(
        () => {
          // 권한이 허용되면 coordinates가 자동으로 업데이트됨
          // isRequesting은 hasActualLocation이 true가 될 때 false로 변경됨
        },
        (error) => {
          console.error("Location error:", error);
          setIsRequesting(false); // 에러 발생 시에는 즉시 false로 변경
        }
      );
    }
  };

  const handleClick = () => {
    if (hasActualLocation) {
      // 실제 위치 정보가 있는 경우 가까운 맛집 페이지로 이동
      navigate("/board/restaurant?filter=가까운순");
    } else {
      // 실제 위치 정보가 없는 경우 위치 정보 요청
      handleLocationRequest();
    }
  };

  // permissionState가 undefined일 때는 아직 권한 상태 체크가 안된 것이므로 렌더링하지 않음
  if (permissionState === undefined) {
    return null;
  }

  return (
    <Tooltip
      content={
        hasActualLocation
          ? "가까운 맛집 보러가기"
          : "현재위치를 설정하고 가까운 맛집을 찾아보세요!"
      }
    >
      <LocationIndicator onClick={handleClick}>
        {isRequesting ? (
          <SpinnerIcon width="20" height="20" />
        ) : (
          <LocationIcon
            width="20"
            height="20"
            fill={
              hasActualLocation ? theme.colors.success[7] : theme.colors.gray[6]
            }
          />
        )}
      </LocationIndicator>
    </Tooltip>
  );
};

const LocationIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${theme.colors.white};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  }
`;
