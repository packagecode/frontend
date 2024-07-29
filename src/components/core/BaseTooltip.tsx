import React from "react";
import {
  OverlayTrigger,
  OverlayTriggerProps,
  Tooltip,
  TooltipProps
} from "react-bootstrap";

interface CustomTooltipProps
  extends Omit<OverlayTriggerProps, "overlay">,
    TooltipProps {
  content: string;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

const BaseTooltip = React.forwardRef<HTMLElement, CustomTooltipProps>(
  ({ content, children, placement = "top", ...props }, ref) => {
    return (
      <OverlayTrigger
        placement={placement}
        overlay={<Tooltip {...props}>{content}</Tooltip>}
      >
        {React.cloneElement(children, { ref })}
      </OverlayTrigger>
    );
  }
);

export default BaseTooltip;
