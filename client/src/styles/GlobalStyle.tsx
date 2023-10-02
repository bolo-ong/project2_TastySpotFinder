import { Global, css } from "@emotion/react";
import reset from "emotion-reset";

export const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        ${reset}
        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
        }

        @font-face {
          font-family: "Pretendard Variable";
          src: url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/variable/pretendardvariable-dynamic-subset.css");
        }
        :root {
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;

          //피그마 글로버 스타일

          /* font sizes */
          --font-size-sm: 14px;
          --font-size-md: 16px;
          --font-size-lg: 18px;
          /* Colors */
          --color-white: #fff;
          --color-black: #333;
          --color-gray: #e9ebed;
          --color-darkgray: #9b9ea1;
          --color-main: #79482d;

          /* Gaps */
          --gap-xl: 20px;
          --gap-base: 16px;
          --gap-5xs: 8px;
          /* Paddings */
          --padding-9xs: 4px;
          --padding-10xs: 3px;
          --padding-8xs: 5px;
          --padding-base: 16px;
          --padding-5xs: 8px;
          --padding-xs: 12px;
          /* Border radiuses */
          --br-81xl: 100px;
          --br-xs: 12px;
        }

        a {
          text-decoration: none;
          color: var(--color-black);
        }
      `}
    />
  );
};
