import { useState, useEffect } from "react";
import { getWeatherData } from "apis/weatherAPI";
import { getLocation } from "utils";

/**
 * getLocation util 함수와 getWeatherData API를 사용해서 온도와 날씨를 return해줌
 * @returns {{ temperature: string | null, condition: string | null }}
 */
export const useGetWeatherData = () => {
  const [temperature, setTemperature] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { latitude, longitude } = await getLocation();

        const { temperature, condition } = await getWeatherData(
          latitude,
          longitude
        );
        setTemperature(temperature);
        setCondition(condition);
      } catch (err) {
        console.error("날씨 정보를 가져오는 중 오류 발생:", err);
      }
    };

    fetchData();
  }, []);

  return { temperature, condition };
};
