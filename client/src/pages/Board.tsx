import React from "react";
import styled from "@emotion/styled";
import { Navbar } from "components";

export const Board = () => {
  return (
    <Container>
      <Navbar />
    </Container>
  );
};

const Container = styled.div`
  width: 80rem;
  margin: 0 auto;
`;
