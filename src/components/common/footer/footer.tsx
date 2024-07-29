import { FC, Fragment } from "react";
import { Link } from "react-router-dom";
import store from "../../../redux/store";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const { defaultDashboard } = store.getState();
  return (
    <Fragment>
      <footer className="footer mt-auto py-3 bg-white text-center">
        <div className="container">
          <span className="text-muted">
            {" "}
            Copyright © {new Date().getFullYear()} <span id="year"></span>{" "}
            <Link to={`/${defaultDashboard}`} className="text-dark fw-semibold">
              Sokrio DMS
            </Link>
            . Designed with{" "}
            <span className="bi bi-heart-fill text-danger"></span> by{" "}
            <a
              href="https://www.sokrio.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="fw-semibold text-primary text-decoration-underline">
                Sokrio
              </span>
            </a>{" "}
            All rights reserved
          </span>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
