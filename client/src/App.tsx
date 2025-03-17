import { Toast } from "components";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toast />
    </>
  );
};

export default App;
