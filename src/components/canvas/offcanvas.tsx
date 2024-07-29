import React from "react";
import { Offcanvas, OffcanvasProps } from "react-bootstrap";
import { OffcanvasPlacement } from "react-bootstrap/esm/Offcanvas";

interface BaseOffcanvasProps extends OffcanvasProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  backdrop?: boolean | string;
  tabIndex?: number;
  placement?: OffcanvasPlacement;
}

const BaseCanvas: React.FC<BaseOffcanvasProps> = ({
  header,
  body,
  footer,
  backdrop = "static",
  tabIndex = -1,
  placement = "end",
  ...props
}) => {
  return (
    <Offcanvas
      backdrop={backdrop}
      tabIndex={tabIndex}
      placement={placement}
      {...props}
    >
      {header && <Offcanvas.Header closeButton>{header}</Offcanvas.Header>}
      <Offcanvas.Body>
        {body}
        {footer && <div className="mt-3">{footer}</div>}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BaseCanvas;
