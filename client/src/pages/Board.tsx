import React from "react";
import styled from "@emotion/styled";
import { Navbar, SearchBar } from "components";

export const Board = () => {
  return (
    <Container>
      <Navbar />
      <SearchBar />
    </Container>
  );
};

const Container = styled.div`
  width: 80rem;
  margin: 0 auto;
`;
