import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, type User } from "./store/slices/authSlice";
import authAPI from "./services/auth/authAPI";

function App() {
  const routing = useRoutes(routes);
  const dispatch =  useDispatch();

  useEffect(() => {
   const loadUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        const user = response.data as User;
        dispatch(setUser(user));
      } catch (e) {
        console.error('Tải thông tin user thất bại:', e);
      }
    };

    if (localStorage.getItem('accessToken')) {
      loadUser();
    }
  }, []);

  return (
    <>
      {routing}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          className: "bg-white text-black",
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      ></Toaster>
    </>
  );
}

export default App;
