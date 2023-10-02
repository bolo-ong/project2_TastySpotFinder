import styled from "@emotion/styled";
import { Logo } from "./common/Logo";
import { Navgation } from "./Navgation";

export const Navbar = () => {
  return (
    <Container>
      <Logo />
      <Navgation />
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--color-black);
`;
