import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import Loader from "@/components/common/loader/loader";
import Sidebar from "@/components/common/sidebar/sidebar";
import Switcher from "@/components/common/switcher/switcher";
import TabToTop from "@/components/common/tabtotop/tabtotop";
import { Fragment, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";

function App() {
  const [myClassName, setMyClass] = useState("");

  const BodyClick = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
  };

  const [isLoading, setIsLoading] = useState(
    localStorage.ynexloaderdisable != "disable"
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <Fragment>
      {isLoading && <Loader></Loader>}
      <HelmetProvider>
        <Helmet
          htmlAttributes={{
            lang: "en",
            dir: "ltr",
            "data-menu-styles": "dark",
            "data-theme-mode": "light",
            "data-nav-layout": "vertical",
            "data-header-styles": "light",
            "data-vertical-style": "overlay",
            "data-loader": "disable",
            "data-icon-text": myClassName
          }}
        />
        <Switcher />
        <div className="page">
          <Header />
          <Sidebar />
          <div className="main-content app-content" onClick={BodyClick}>
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
        <TabToTop />
      </HelmetProvider>
      {/* <div id="responsive-overlay"></div> */}
    </Fragment>
  );
}

export default App;
