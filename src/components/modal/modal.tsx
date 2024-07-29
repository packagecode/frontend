import { Button } from "@/components";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";
import React from "react";

interface MyModalProps extends ModalProps {
  title: string | React.ReactNode;
  body: React.ReactNode;
  moreBtns?: React.ReactNode;
  show?: boolean;
  maskClosable?: boolean;
  footer?: React.ReactNode;
  width?: number | string;
}

const BaseModal: React.FC<MyModalProps> = ({
  title,
  body,
  show = false,
  onCancel,
  onOk,
  maskClosable = true,
  footer = (
    <Button
      key="close"
      variant="outline-danger"
      type="button"
      size="sm"
      onClick={onCancel}
    >
      Close
    </Button>
  ),
  width,
  moreBtns,
  ...props
}) => {
  const defaultWidth = 520;
  const getWidth = () => {
    const widthMap: { [key: string]: number } = {
      sm: 320,
      md: 520,
      lg: 720,
      xl: 920,
      xxl: 1120,
      xxxl: 1320
    };

    if (typeof width === "number") {
      return width;
    }

    if (
      typeof width === "string" &&
      Object.prototype.hasOwnProperty.call(widthMap, width)
    ) {
      return widthMap[width];
    }

    return defaultWidth;
  };
  return (
    <Modal
      {...props}
      title={title}
      open={show}
      onCancel={onCancel}
      onOk={onOk}
      maskClosable={maskClosable}
      footer={footer}
      width={getWidth()}
    >
      {body}
    </Modal>
  );
};

export default React.memo(BaseModal);
