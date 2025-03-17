import { Outlet, ScrollRestoration } from "react-router-dom";
import { ScrollToTopButton } from "components";

export const Layout = () => {
  return (
    <>
      <ScrollRestoration
        getKey={(location, matches) => {
          // 스크롤 위치를 기억하고 싶은 path만 입력, ex) const paths = ["/posting", "/detail/restaurant/:id?"];
          const paths: string[] = [];

          // 동적 라우팅 매치를 위한 함수
          const customMatchPath = (path: string, pathname: string) => {
            const regex = new RegExp(path.replace(/:[^/]+/g, "([^/]+)?"));
            return regex.test(pathname);
          };

          const isMatchingPath = paths.some((path) =>
            customMatchPath(path, location.pathname)
          );

          return isMatchingPath ? location.pathname : location.key;
        }}
      />
      <ScrollToTopButton />

      <Outlet />
    </>
  );
};
