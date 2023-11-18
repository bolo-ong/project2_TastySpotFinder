/**
 * Geolocation API, 위도와 경도를 return해줌
 * @returns {Promise<{ latitude: number; longitude: number }>}
 */

export const getLocation = () => {
  const initializeLatitude = 37.571411;
  const initializeLongitude = 126.96579; // 초기값은 서울 기상 관측소의 위도와 경도
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            console.log(err);
            // 에러 발생 시 이니셜값 사용
            resolve({
              latitude: initializeLatitude,
              longitude: initializeLongitude,
            });
          },
          {
            enableHighAccuracy: false,
            maximumAge: 3600000,
            timeout: 15000,
          }
        );
      } else {
        // 브라우저가 위치 정보 제공을 지원하지 않는 경우에도 이니셜값 사용
        resolve({
          latitude: initializeLatitude,
          longitude: initializeLongitude,
        });
      }
    }
  );
};
