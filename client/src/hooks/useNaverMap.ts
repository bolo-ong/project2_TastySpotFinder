import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "styles/theme";
import { Restaurant } from "types";

interface Coordinates {
  x: number;
  y: number;
}

interface UseNaverMapProps {
  containerId: string;
  data: Restaurant | Restaurant[];
}

export const useNaverMap = ({ containerId, data }: UseNaverMapProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 좌표 목록을 저장할 상태 변수
  const [coordinatesList, setCoordinatesList] = useState<Coordinates[] | null>(
    null
  );

  // 지도 인스턴스를 저장할 상태 변수
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);

  // 마커 목록을 저장할 상태 변수
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

  // 식당 데이터를 기반으로 좌표 목록 설정
  useEffect(() => {
    if (data) {
      const detailsArray = Array.isArray(data) ? data : [data];
      const coords = detailsArray.map((restaurantDetail) => {
        const [longitude, latitude] =
          restaurantDetail.locationCoordinates.coordinates;
        return { x: longitude, y: latitude };
      });
      setCoordinatesList(coords);
    }
  }, [data]);

  // 지도 초기화 함수
  const initializeMap = () => {
    if (coordinatesList && coordinatesList.length > 0) {
      const map = new naver.maps.Map(containerId, {
        center: new naver.maps.LatLng(
          coordinatesList[0].y,
          coordinatesList[0].x
        ),
        logoControl: false,
        mapDataControl: true,
        scrollWheel: false,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      setMapInstance(map);
      return map;
    }
    return null;
  };

  // 지도에 마커를 추가하는 함수
  const addMarkers = (map: naver.maps.Map) => {
    if (!coordinatesList) return;

    const newMarkers: naver.maps.Marker[] = [];

    // 이전 마커 및 이벤트 리스너 제거
    markers.forEach((marker) => {
      naver.maps.Event.clearListeners(marker, "click");
      naver.maps.Event.clearListeners(marker, "mouseover");
      naver.maps.Event.clearListeners(marker, "mouseout");
      marker.setMap(null);
    });

    // 새로운 마커 추가
    for (let index = coordinatesList.length - 1; index >= 0; index--) {
      const coordinates = coordinatesList[index];
      const restaurantDetail = Array.isArray(data) ? data[index] : data;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coordinates.y, coordinates.x),
        map: map,
        icon: {
          content: `
            <div style="${markerStyle}" class="custom-marker-${index}">
              <div style="${iconStyle}">${index + 1}</div>
              <div style="${textWrapperStyle}">
                <p style="${titleStyle}">${restaurantDetail.name}</p>
                <p style="${categoryStyle}">${restaurantDetail.category}</p>
              </div>
              <div style="${pointerStyle}"></div>
            </div>
            `,
          anchor: new naver.maps.Point(20, 50),
        },
      });

      newMarkers.push(marker);

      // 마커 클릭 시 해당 식당 디테일 페이지로 이동
      naver.maps.Event.addListener(marker, "click", () => {
        const url = `/detail/restaurant/${restaurantDetail._id}`;
        if (location.pathname !== url) {
          navigate(url);
        }
      });

      // 마우스 오버 이벤트 리스너 추가
      naver.maps.Event.addListener(marker, "mouseover", () => {
        const markerElement = document.querySelector(
          `.custom-marker-${index}`
        ) as HTMLElement;
        if (markerElement) {
          markerElement.style.zIndex = "1000";
          markerElement.style.backgroundColor = theme.colors.gray[1];
        }
      });

      // 마우스 아웃 이벤트 리스너 추가
      naver.maps.Event.addListener(marker, "mouseout", () => {
        const markerElement = document.querySelector(
          `.custom-marker-${index}`
        ) as HTMLElement;
        if (markerElement) {
          markerElement.style.zIndex = "0";
          markerElement.style.backgroundColor = theme.colors.white;
        }
      });
    }

    setMarkers(newMarkers);
  };

  // 네이버 지도 스크립트를 로드하고 지도를 초기화하는 효과
  useEffect(() => {
    if (coordinatesList) {
      const scriptId = "naver-maps-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NCP_Client_ID}&submodules=geocoder,drawing`;
        script.async = true;
        script.onload = () => {
          const map = initializeMap();
          if (map) addMarkers(map);
        };
        document.head.appendChild(script);
      } else if (window.naver && window.naver.maps) {
        const map = initializeMap();
        if (map) addMarkers(map);
      }
    }

    // 컴포넌트 언마운트 시 맵 인스턴스 제거
    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [coordinatesList]);

  // 경로가 변경될 때마다 마커를 추가하는 효과
  useEffect(() => {
    if (mapInstance && coordinatesList) {
      addMarkers(mapInstance);
    }
  }, [mapInstance, coordinatesList, location.pathname]);

  return { mapInstance, markers };
};

// 마커 스타일
const markerStyle = `
  height: 2.5rem;
  background-color: ${theme.colors.white};
  border: 0.0625rem solid ${theme.colors.main[5]};
  border-radius: 1.875rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem 0 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 0.25rem 0;
  position: relative;
  z-index: 0;
`;

const iconStyle = `
  width: 1.5rem;
  height: 1.5rem;
  background-color: ${theme.colors.main[5]};
  border-radius: 50%;
  font-size: 0.8125rem;
  color: ${theme.colors.white};
  text-align: center;
  line-height: 1.5rem;
`;

const textWrapperStyle = `
  margin-left: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const titleStyle = `
  font-size: 0.75rem;
  color: ${theme.colors.black};
  margin: 0;
`;

const categoryStyle = `
  font-size: 0.625rem;
  color: ${theme.colors.gray[6]};
  margin: 0;
  white-space: nowrap;
  word-wrap: nowrap;
`;

const pointerStyle = `
  width: 0.125rem;
  height: 1.25rem;
  border-radius: 0.0437rem;
  background-color: ${theme.colors.main[5]};
  position: absolute;
  top: 1.875rem;
  left: 1.1875rem;
`;
