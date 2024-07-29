import React, { Fragment } from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

interface PageheaderProps {
  title: string;
  heading: string;
  headingHref?: string;
  active: string;
}

const Pageheader = (props: PageheaderProps) => {
  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <h1 className="page-title fw-semibold fs-18 mb-0">{props.title}</h1>
        <div className="ms-md-1 ms-0">
          <Breadcrumb className="mb-0">
            {props.headingHref ? (
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: props.headingHref }}
              >
                {props.heading}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item>{props.heading}</Breadcrumb.Item>
            )}
            <Breadcrumb.Item active aria-current="page">
              {props.active}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
    </Fragment>
  );
};

const areEqual = (prevProps: PageheaderProps, nextProps: PageheaderProps) => {
  // Return true if the props are equal
  return (
    prevProps.title === nextProps.title &&
    prevProps.heading === nextProps.heading &&
    prevProps.headingHref === nextProps.headingHref &&
    prevProps.active === nextProps.active
  );
};

export default React.memo(Pageheader, areEqual);
