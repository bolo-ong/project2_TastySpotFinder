import { useEffect } from "react";

export const useNaverMap = () => {
  //todo : 식당 리스트 받아와서 마커 여러개 찍기 구현, 제목으로 주소 구하고, 구한 좌표 + 제목과 컨텐츠 마커에 표시

  useEffect(() => {
    naver.maps.Service.geocode(
      {
        query: "서울특별시 서대문구 북아현동 125-19", //받아온 식당 주소
      },
      function (status, res) {
        const data = res.v2.addresses;
        // console.log(data[0].distance); 거리 필요시 사용
        console.log(data[0].x);
        console.log(data[0].y);
      }
    );

    // 처음 화면에 로드되는 지도 처음에 어디를 보여줄지 고민해봐야함
    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.5580702, 126.9571456), // 지도에 중심에 표시되는 장소(y,x) 위의 데이터에서 가져오기
      logoControl: false,
      mapDataControl: true,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
      // minZoom: 8, // 최소 줌
      // zoom: 20, // 처음 로드 되었을 때 줌 상태
      // maxZoom: 20, // 최대 줌
      // scaleControl: true, ...
    });

    const title = "백산왕삼계탕";
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5580702, 126.9571456),
      map: map,
      icon: {
        content: `
        <div style="height: 40px; background-color: #ffffff; border: 1px solid #79482D; border-radius: 30px; display: flex; flex-direction: row; align-items: center; justify-content: center; padding:0px 12px 0px 8px; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 4px 0px;">
            <div style="width: 24px; height: 24px; background-color: #79482D; border-radius: 50%; font-size: 13px; color: #fff; text-align: center; line-height: 24px;">1</div>
            <div style="margin-left: 8px;">
                <p style="font-size: 12px; color: #202020; margin: 0; ">${title}</p>
                <p style="font-size: 10px; color: #8e8e8e; margin: 0; ">백숙,삼계탕</p>
            </div>
        </div>
        <div style="width:2px; height:20px; border-radius: 0.7px; background-color: #79482D; position:absolute; top:30px; left:20px;"></div>
        `,
        anchor: new naver.maps.Point(20, 50),
      },
    });
  }, []);
};
