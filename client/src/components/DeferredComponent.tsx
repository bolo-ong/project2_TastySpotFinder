import React, { PropsWithChildren, useEffect, useState } from "react";

//https://tech.kakaopay.com/post/skeleton-ui-idea/ 무조건 스켈레톤을 보여주는게 사용자 경험에 도움이 될까요??
export const DeferredComponent = ({ children }: PropsWithChildren<{}>) => {
  const [isDeferred, setIsDeferred] = useState(false);

  useEffect(() => {
    // 200ms 지난 후 children Render
    const timeoutId = setTimeout(() => {
      setIsDeferred(true);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isDeferred) {
    return null;
  }

  return <>{children}</>;
};
