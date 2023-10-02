import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main, Board } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styled from "@emotion/styled";
import { GlobalStyle } from "./styles/GlobalStyle";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Wrapper>
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/board" element={<Board />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </Router>
        </Wrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </>
);

const Wrapper = styled.div`
  min-width: 1340px;
  margin: 0 auto;
`;

export default App;
