import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
로그인 이후 서버에서 redirect시켜주는 페이지로
로그인 이전 페이지인 prevPath값으로 이동시켜줌
 */

export const LogInRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    navigate(prevPath || "/", { replace: true });
    localStorage.removeItem("prevPath");
  }, []);

  return null;
};
