import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    navigate(prevPath || "/");
    localStorage.removeItem("prevPath");
  }, []);

  return null;
};
