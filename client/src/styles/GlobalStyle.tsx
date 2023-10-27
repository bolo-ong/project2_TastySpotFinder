import { Global, css } from "@emotion/react";
import reset from "emotion-reset";
import { theme } from "styles/theme";

export const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/variable/pretendardvariable-dynamic-subset.css");
        ${reset}
        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
        }

        #root {
          height: 100%;
          word-break: break-all;
          word-wrap: break-word;
          color: ${theme.colors.black};
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
        }

        html,
        body {
          height: 100%;
        }
        a {
          height: 100%;
          color: inherit;
          text-decoration: none;
        }
        a.active {
          color: ${theme.colors.main[5]};
        }
        button {
          padding: 0;
          text-align: inherit;
          font: inherit;
          letter-spacing: inherit;
          color: inherit;
          background: none;
          border: none;
          cursor: pointer;
        }
        input {
          padding: 0;
          font: inherit;
          letter-spacing: inherit;
          color: inherit;
          background: none;
          border: none;
        }
        textarea {
          padding: 0;
          vertical-align: middle;
          font: inherit;
          letter-spacing: inherit;
          color: inherit;
          background: none;
          border: none;
          resize: none;
        }
      `}
    />
  );
};
