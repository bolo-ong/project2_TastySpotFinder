import { useLocation } from "react-router-dom";

export const useRestaurantType = () => {
  const location = useLocation();
  if (location.pathname.toLowerCase().includes("restaurantlist")) {
    return "restaurantList";
  }
  return "restaurant";
};
