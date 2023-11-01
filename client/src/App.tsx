import { ThemeProvider } from "@emotion/react";
import { theme, GlobalStyle } from "./styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Main, Board, LogIn, Posting } from "./pages";
import { RecoilRoot } from "recoil";

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
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/board" element={<Board />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/posting" element={<Posting />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </Router>

          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  </>
);

export default App;
