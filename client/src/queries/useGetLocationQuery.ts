import { useQuery } from "@tanstack/react-query";
import { getLocation, monitorLocationPermission } from "utils/locationUtils";
import { useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt" | undefined;

/**
 * 위치 정보를 가져오는 훅
 * @returns {{
 *   coordinates: { latitude: number; longitude: number; isInitialLocation: boolean } | null;
 *   permissionState: PermissionState;
 *   isPermissionChecked: boolean;
 *   getLocationLoading: boolean;
 *   getLocationError: boolean;
 * }}
 */
export const useGetLocationQuery = () => {
  const [permissionState, setPermissionState] = useState<PermissionState>();

  const {
    data: coordinates,
    isLoading: getLocationLoading,
    isError: getLocationError,
  } = useQuery(
    ["location"],
    async () => {
      const location = await getLocation();
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        isInitialLocation: location.isInitialLocation,
      };
    },
    {
      // 권한이 허용된 경우에만 쿼리 실행
      enabled: permissionState === "granted",
      refetchOnWindowFocus: false,
      staleTime: 0, // 항상 최신 데이터를 사용
      cacheTime: 1000 * 60 * 5, // 5분간 캐시 유지
      retry: false, // 실패시 재시도하지 않음
    }
  );

  useEffect(() => {
    monitorLocationPermission(setPermissionState);
  }, []);

  return {
    // 권한이 거부되었을 때는 null 반환
    // 권한이 허용되었을 때는 실제 위치 정보 제공
    coordinates: permissionState === "denied" ? null : coordinates,
    permissionState,
    isPermissionChecked: permissionState !== undefined,
    getLocationLoading,
    getLocationError,
  };
};
