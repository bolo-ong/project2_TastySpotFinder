import { ThemeProvider } from "@emotion/react";
import { theme, GlobalStyle } from "./styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Main, Board, LogIn, Posting, LogInRedirectPage } from "./pages";
import { RecoilRoot } from "recoil";
import { PublicRoute, PrivateRoute } from "routes";
import { Toast } from "components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Toast />

            <Router>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/board" element={<Board />} />
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LogIn />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/posting" element={<Posting />} />
                </Route>
                <Route path="/redirect" element={<LogInRedirectPage />} />
                <Route path="*" element={<div>404</div>} />
              </Routes>
            </Router>

            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
};

export default App;
