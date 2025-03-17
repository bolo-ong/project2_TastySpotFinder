import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "apis/weatherAPI";
import { useGetLocationQuery } from "queries";

/**
 * useGetLocationQuery와 getWeatherData API를 사용해서 온도와 날씨를 return해줌
 * 위치 정보가 있으면 해당 위치의 날씨를, 없으면 기본 위치의 날씨를 보여줌
 * @returns {{ temperature: string | null, condition: string | null }}
 */
export const useGetWeatherDataQuery = () => {
  const { coordinates } = useGetLocationQuery();

  // 서울 기상관측소 좌표
  const defaultCoordinates = {
    latitude: 37.571411,
    longitude: 126.96579,
  };

  const {
    data: weatherData,
    isLoading: getWeatherDataLoading,
    isError: getWeatherDataError,
  } = useQuery(
    ["weather"],
    async () => {
      // coordinates가 없으면 서울 기상관측소 좌표 사용
      const location = coordinates || defaultCoordinates;
      return getWeatherData(location.latitude, location.longitude);
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 30, // 30분
      retry: false,
    }
  );

  return {
    temperature: weatherData?.temperature,
    condition: weatherData?.condition,
    getWeatherDataLoading,
    getWeatherDataError,
  };
};
