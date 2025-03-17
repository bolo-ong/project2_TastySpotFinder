import axios from "axios";

export interface GeocodeResponse {
  addresses: {
    x: string;
    y: string;
  }[];
}

// 크롤링한 식당의 주소를 위,경도로 변환하기 위한 함수
export const geocodeAddress = async (
  address: string
): Promise<[number, number]> => {
  const response = await axios.get<GeocodeResponse>(
    "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
    {
      params: {
        query: address,
      },
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.X_NCP_APIGW_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": process.env.X_NCP_APIGW_API_KEY,
      },
    }
  );

  if (response.data.addresses.length === 0) {
    throw new Error(`No coordinates found for the given address: ${address}`);
  }

  const data = response.data.addresses[0];
  return [parseFloat(data.x), parseFloat(data.y)]; // [longitude, latitude]
};
