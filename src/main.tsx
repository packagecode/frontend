import store from "@/redux/store";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import Loader from "./components/common/loader/loader.tsx";
import { SettingsProvider } from "./contexts/SettingsContext";
import { SetupWizardProvider } from "./contexts/SetupWizardContext.tsx";
import AppRoutes from "./routes/index.tsx";

import "./assets/css/sokrio.css";
import "./index.scss";

export const DMS_BASE_URL: string = import.meta.env.BASE_URL;

registerSW({
  onRegistered() {
    console.log("SW has been registered");
  },
  onNeedRefresh() {
    console.log("Need to refresh");
  },
  onOfflineReady() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <Provider store={store}>
        <Toaster position="top-right" reverseOrder={false} />
        <React.Suspense fallback={<Loader />}>
          <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
            <SettingsProvider>
              <SetupWizardProvider>
                <AppRoutes />
              </SetupWizardProvider>
            </SettingsProvider>
          </ConfigProvider>
        </React.Suspense>
      </Provider>
    </BrowserRouter>
  </React.Fragment>
);
