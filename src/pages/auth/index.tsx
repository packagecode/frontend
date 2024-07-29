import store from "@/redux/store.tsx";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const subdomain = window.location.hostname.split(".")[0];
    if (["app", "www"].includes(subdomain)) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </div>
  );
};

export default Auth;
