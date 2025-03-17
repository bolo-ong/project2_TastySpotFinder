import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { keyframes } from "@emotion/react";
import { useRecoilState } from "recoil";
import { toastState, ToastState } from "recoil/atoms";
import { Portal, Image } from "components";
import { useEffect } from "react";
import { useToast } from "hooks";

export const Toast = () => {
  const id = new Date().getTime().toString();
  const [toast] = useRecoilState(toastState);
  const { hideToast } = useToast();
  const { isOpen, variant, message } = toast;

  useEffect(() => {
    if (isOpen) {
      let timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [id]);

  return (
    <>
      {isOpen && (
        <Portal>
          <Container>
            <ToastItem key={id} variant={variant}>
              <Image
                name={`icon_${variant}_circle`}
                extension="svg"
                width={20}
                height={20}
              />
              {message}
            </ToastItem>
          </Container>
        </Portal>
      )}
    </>
  );
};

const fadeInAnimation = keyframes`
0%{
    transform: translateY(100%);
 
}
100%{
    transform: translateY(0);
 
}`;

const fadeOutAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Container = styled.div`
  position: fixed;

  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);

  z-index: 100000;
`;

const ToastItem = styled.div<{ variant: ToastState["variant"] }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  gap: 0.75rem;
  width: 17.5rem;
  padding: 0.875rem 1.5rem;

  line-height: 120%;
  font-weight: 500;
  font-size: 0.875rem;

  border-radius: 1rem;
  box-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.08);
  border: ${({ variant }) => variants[variant || "success"].border};

  color: ${theme.colors.black};
  background-color: ${({ variant }) =>
    variants[variant || "success"].backgroundColor};

  animation: ${fadeInAnimation} 0.5s, ${fadeOutAnimation} 0.3s 3.7s;
  animation-fill-mode: forwards;
`;

const variants = {
  success: {
    backgroundColor: theme.colors.success,
    border: `0.0625rem solid ${theme.colors.success[1]}`,
  },
  info: {
    backgroundColor: theme.colors.info,
    border: `0.0625rem solid ${theme.colors.info[1]}`,
  },
  warning: {
    backgroundColor: theme.colors.warning,
    border: `0.0625rem solid ${theme.colors.warning[1]}`,
  },
};
