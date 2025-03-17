/**
 * Geolocation API, 위도와 경도를 return해줌
 * @returns {Promise<{ latitude: number; longitude: number; isInitialLocation: boolean; }>}
 */

export const getLocation = () => {
  const initializeLatitude = 37.571411;
  const initializeLongitude = 126.96579; // 초기값은 서울 기상 관측소의 위도와 경도

  return new Promise<{
    latitude: number;
    longitude: number;
    isInitialLocation: boolean;
  }>((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  isInitialLocation: false,
                });
              },
              (err) => {
                console.log(err);
                // 에러 발생 시 이니셜값 사용
                resolve({
                  latitude: initializeLatitude,
                  longitude: initializeLongitude,
                  isInitialLocation: true,
                });
              },
              {
                maximumAge: 1800000, // 30분
                timeout: 15000, // 15초
              }
            );
          } else {
            // 권한이 거부되거나 응답하지 않은 경우 이니셜값 사용
            resolve({
              latitude: initializeLatitude,
              longitude: initializeLongitude,
              isInitialLocation: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          // 권한 상태 확인 실패 시 이니셜값 사용
          resolve({
            latitude: initializeLatitude,
            longitude: initializeLongitude,
            isInitialLocation: true,
          });
        });
    } else {
      // 브라우저가 위치 정보 제공을 지원하지 않는 경우에도 이니셜값 사용
      resolve({
        latitude: initializeLatitude,
        longitude: initializeLongitude,
        isInitialLocation: true,
      });
    }
  });
};

/**
 * 위치 권한 상태를 지속적으로 모니터링하는 함수
 * @param callback {Function} 권한 상태가 변경될 때 호출되는 콜백 함수
 */
export const monitorLocationPermission = (
  callback: (state: PermissionState) => void
) => {
  if ("permissions" in navigator) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        // 초기 상태를 콜백으로 전달
        callback(result.state);
        // 권한 상태 변경 시 콜백 호출
        result.onchange = () => {
          callback(result.state);
        };
      })
      .catch((err) => {
        console.error("Permission monitoring error:", err);
      });
  } else {
    // permissions API를 지원하지 않는 경우
    console.warn("Permissions API not supported");
  }
};
