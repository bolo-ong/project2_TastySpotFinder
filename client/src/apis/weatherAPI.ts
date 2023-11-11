import axios from "apis";

export const getWeatherData = async (lat: number, lon: number) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`;
  try {
    const res = await axios.get(apiUrl);

    const tempKelvin = res.data.main.temp; //화씨
    const tempCelsius: string | null = (tempKelvin - 273.15).toFixed(); //섭씨
    const condition: string | null = res.data.weather[0].main; //눈,비,흐림 등 날씨

    return { temperature: tempCelsius, condition };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
