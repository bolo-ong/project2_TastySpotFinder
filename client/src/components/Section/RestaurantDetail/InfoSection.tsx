import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Text, Image, BookMarkButton, CopyUrlButton } from "components";
import { theme } from "styles/theme";
import {
  useGetUserProfileDataQuery,
  usePatchLikeRestaurantMutation,
} from "queries";
import { useToast } from "hooks";
import { Restaurant } from "types";

export interface Props {
  restaurantDetail: Restaurant;
}
export const InfoSection = ({ restaurantDetail }: Props) => {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState<string>(
    restaurantDetail.img[0]
  );
  const likeRestaurantMutation = usePatchLikeRestaurantMutation("restaurant");
  const { userProfile } = useGetUserProfileDataQuery();
  const isSavedRestaurant = userProfile?.savedRestaurants?.includes(id);
  const { showToast } = useToast();

  // restaurantDetail이 변경될 때마다 selectedImg 초기화
  useEffect(() => {
    setSelectedImg(restaurantDetail.img[0]);
  }, [restaurantDetail]);

  const handleBookMarkButtonClick = () => {
    userProfile === "Login required"
      ? showToast("로그인 후 이용해 주세요.", "info")
      : likeRestaurantMutation.mutate(id!);
  };

  // 클릭 시, 네이버 플레이스 페이지 새 창에서 열기
  const handleCardClick = () => {
    const url = `https://map.naver.com/p/entry/place/${restaurantDetail.naverPlaceId}`;
    window.open(url, "_blank");
  };

  return (
    <Section>
      <Thumbnail>
        {restaurantDetail.img.map((img: string) => (
          <li key={img}>
            {img === selectedImg ? (
              <SelectedCard src={img} width={80} height={80} />
            ) : (
              <Card
                src={img}
                width={80}
                height={80}
                onClick={() => setSelectedImg(img)}
              />
            )}
          </li>
        ))}
      </Thumbnail>
      <Card
        src={selectedImg || restaurantDetail.img[0]}
        width={464}
        height={464}
      />

      <RestaurantInfoItems>
        <Header>
          <TitleContainer onClick={handleCardClick}>
            <Text size={32} weight={600}>
              {restaurantDetail.name}
            </Text>
            <Image
              name="logo_naver_map"
              extension="svg"
              width={32}
              height={32}
            />
          </TitleContainer>

          <ButtonContainer>
            <BookMarkButton
              onClick={handleBookMarkButtonClick}
              isSaved={isSavedRestaurant}
              count={restaurantDetail.like}
            />
            <CopyUrlButton />
          </ButtonContainer>
        </Header>

        <Text color={theme.colors.gray[6]}>{restaurantDetail.category}</Text>
        <InfoTextContainer>
          <Image name="icon_location" width="16" height="16" extension="svg" />
          <Text size={16}>{restaurantDetail.location}</Text>
        </InfoTextContainer>
        <InfoTextContainer>
          <Image name="icon_contact" width="16" height="16" extension="svg" />
          <Text size={16}>{restaurantDetail.contact}</Text>
        </InfoTextContainer>
      </RestaurantInfoItems>
    </Section>
  );
};

const Section = styled.section`
  width: 100%;
  display: flex;
  padding-bottom: 2rem;
  border-bottom: 0.125rem solid #e9ebf8;
`;

const Thumbnail = styled.ul`
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin-right: 0.625rem;
  gap: 0.625rem;

  & > li > a > div {
    position: relative;
    &:hover::after {
      content: "";
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      opacity: 0.4;
    }
  }
`;

const SelectedCard = styled(Card)`
  & > div {
    border: 0.125rem solid ${theme.colors.main[3]};
  }
`;

const RestaurantInfoItems = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: column;
  margin-left: 3.125rem;

  > :nth-of-type(1) {
    margin-bottom: 1rem;
  }
  > :nth-of-type(2) {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span:nth-of-type(1) {
    width: 15rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const InfoTextContainer = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const ButtonContainer = styled.div`
  gap: auto;
  display: flex;
  align-items: center;
  height: fit-content;
  gap: 0.875rem;
`;
