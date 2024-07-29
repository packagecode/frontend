import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { Middleware } from "redux";
import thunk from "redux-thunk";
import { SetSubdomain } from "./action";
import reducer from "./reducer";

const authenticateUser = (tempStore: any) => {
  const tempState = tempStore.getState();
  const isLogin = localStorage.getItem("isLogin");
  if (isLogin && isLogin === "true" && tempState.user?.name) {
    axios.get(`${tempState.apiEndPoint}/me`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
      }
    });
  }
};

const loadState = () => {
  try {
    const host = window.location.host; // e.g., subdomain.example.com
    const subdomain = host.split(".")[0]; // Extract the subdomain

    // Create a temporary store to dispatch the SetSubdomain action
    const tempStore = configureStore({
      reducer: reducer,
      middleware: [thunk]
    });

    // Dispatch the SetSubdomain action to set the initial subdomain
    tempStore.dispatch(SetSubdomain(subdomain));
    // Call the authenticateUser function
    authenticateUser(tempStore);
    // Return the updated state after dispatching the action
    return tempStore.getState();
  } catch (err) {
    console.error("Could not load state:", err);
    return undefined;
  }
};

const preloadedState = loadState();

const middleware: Middleware[] = [thunk]; // Define an array of middleware

const store = configureStore({
  reducer: reducer,
  middleware: middleware, // Pass the middleware array
  preloadedState
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
