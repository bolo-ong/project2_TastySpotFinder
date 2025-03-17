import styled from "@emotion/styled";
import { Image } from "components";

export interface Props {
  rating?: number | string;
  size?: number | string;
}
export const Rating = ({ rating = 0, size = 24 }: Props) => {
  const ratingValue = parseFloat(rating as string);
  return (
    <IconsWrapper>
      {[...Array(5)].map((_, index) => (
        <Image
          key={index}
          name={
            index < Math.floor(ratingValue)
              ? "icon_star_filled"
              : index === Math.floor(ratingValue) && ratingValue % 1 !== 0
              ? "icon_star_half"
              : "icon_star_empty"
          }
          width={size}
          height={size}
          extension="svg"
        />
      ))}
    </IconsWrapper>
  );
};

const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
`;
