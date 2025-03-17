import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { useToast } from "hooks";
import { copyToClipboard } from "utils";
import { Text, Image, Ripple } from "components";

export const CopyUrlButton = () => {
  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;
  const { showToast } = useToast();

  const handleCopyToClipBoard = (url: string) => {
    copyToClipboard(url);
    showToast("URL이 복사 되었습니다.", "info");
  };

  return (
    <Container onClick={() => handleCopyToClipBoard(url)}>
      <ImageWrapper>
        <Image name="icon_share" width="26" height="26" extension="svg" />
      </ImageWrapper>
      {/* <Text size={12}>공유</Text> */}
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
  justify-content: center;
  gap: 0.25rem;
  &:hover {
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.25rem;
`;
