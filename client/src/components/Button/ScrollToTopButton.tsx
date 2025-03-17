import styled from "@emotion/styled";
import { Image } from "components";
import { useShowScrollToTopButton } from "hooks";
import { scrollToTop } from "utils/scrollUtils";

export const ScrollToTopButton = () => {
  const showScrollToTop = useShowScrollToTopButton();

  return (
    <IconWrapper show={showScrollToTop} onClick={scrollToTop}>
      <Image name="icon_scroll_to_top" extension="svg" width={22} height={22} />
    </IconWrapper>
  );
};

const IconWrapper = styled.div<{ show: boolean }>`
  z-index: 10;
  position: fixed;
  cursor: pointer;

  display: ${({ show }) => (show ? "flex" : "none")};
  align-items: center;
  justify-content: center;

  width: 3.5rem;
  height: 3.5rem;

  bottom: 30px;
  right: 30px;

  border-radius: 6.25rem;
  background-color: white;
  box-shadow: 0 0.125rem 0.625rem rgba(63, 71, 77, 0.25);
`;
