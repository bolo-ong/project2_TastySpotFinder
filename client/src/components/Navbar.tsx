import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Image, Navgation } from ".";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <Container>
      <Image
        as={Link}
        to="/"
        width="28"
        height="28"
        name="logo_main"
        extension="png"
      />
      <Navgation />
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  z-index: 10;
  padding: 0 0.5rem 0 1.25rem;
  width: 66rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 1rem;
`;
