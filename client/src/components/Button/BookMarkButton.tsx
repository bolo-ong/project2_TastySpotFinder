import styled from "@emotion/styled";
import { Text, Image, Ripple } from "components";

export interface Props {
  onClick: () => void;
  isSaved: boolean;
  count?: string | number;
}

export const BookMarkButton = ({ onClick, isSaved, count }: Props) => {
  return (
    <Container onClick={onClick}>
      {isSaved ? (
        <Image
          name="icon_bookmarker_filled"
          width="38"
          height="36"
          extension="svg"
        />
      ) : (
        <Image name="icon_bookmarker" width="38" height="36" extension="svg" />
      )}

      {/* {<Text size={12}>{count && count.toLocaleString()}</Text>} */}
      <Ripple />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  gap: 0.25rem;
  &:hover {
    cursor: pointer;
  }
`;
