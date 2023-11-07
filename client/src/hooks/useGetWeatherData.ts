import { useState, useEffect } from "react";
import { getWeatherData } from "apis/weatherAPI";
import { getLocation } from "utils";

export const useGetWeatherData = () => {
  const [temperature, setTemperature] = useState<string>("");
  const [condition, setCondition] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { latitude, longitude } = await getLocation();

        const { tempCelsius, condition } = await getWeatherData(
          latitude,
          longitude
        );
        setTemperature(tempCelsius);
        setCondition(condition);
      } catch (err) {
        console.error("날씨 정보를 가져오는 중 오류 발생:", err);
      }
    };

    fetchData();
  }, []);

  return { temperature, condition };
};
