import styled from "@emotion/styled";
import { Text } from "components";
import { theme } from "styles/theme";
import { Restaurant } from "types";

export interface Props {
  restaurantDetail: Restaurant;
}

export const MenuSection = ({ restaurantDetail }: Props) => {
  // 서버에서 받은 메뉴 데이터를 이름과 가격으로 분리
  const splitMenuArray = restaurantDetail?.menu.map((menuItem) => {
    const regex = /^(.*?)(\d{1,3}(,\d{3})*원|변동|무료)$/;
    const match = menuItem.match(regex);
    if (match) {
      const [, menuName, price] = match;
      return [menuName.trim(), price];
    }
    return [menuItem, undefined];
  });

  return (
    <Section>
      <Container>
        <Text size={18} weight={600}>
          메뉴 정보
        </Text>
        <ul>
          {restaurantDetail &&
            splitMenuArray.map((item, index) => (
              <li key={index}>
                {item[0] !== "" && <Text size={15}>{item[0]}</Text>}
                <Line />
                {item[1] !== "" && <Text size={15}>{item[1]}</Text>}
              </li>
            ))}
        </ul>
      </Container>
    </Section>
  );
};

const Section = styled.section``;

const Container = styled.div`
  width: 56.25rem;
  margin: 6rem auto 0 auto;

  > span:nth-of-type(1) {
    display: inline-block;
    margin-bottom: 2rem;
  }

  > ul > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Line = styled.div`
  flex-grow: 1;
  border: 1px solid ${theme.colors.gray[2]};
  margin: 1rem;
`;
