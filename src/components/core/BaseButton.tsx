import React from "react";
import { Button as MainButton, Spinner } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";

interface MainButtonProps extends ButtonProps {
  loading?: boolean;
  loadingPosition?: "start" | "end";
  onlyLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      loading = false,
      loadingPosition = "end",
      onlyLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const loadingSpinner = (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </>
    );

    return (
      <MainButton ref={ref} {...props} disabled={loading || props.disabled}>
        {onlyLoading && loading && loadingSpinner}
        {!onlyLoading &&
          loading &&
          loadingPosition === "start" &&
          loadingSpinner}{" "}
        {children}{" "}
        {!onlyLoading && loading && loadingPosition === "end" && loadingSpinner}
      </MainButton>
    );
  }
);

export default React.memo(Button);
