import { BaseInput, Button } from "@/components";
import { useState } from "react";
import { InputProps } from "./BaseInput";

interface BasePasswordProps extends Omit<InputProps, "value"> {
  suffix?: boolean;
  value?: string;
}

const BasePassword: React.FC<BasePasswordProps> = ({
  label = "Password",
  name,
  value,
  onChange,
  placeholder = "Enter password",
  feedback,
  suffix = false,
  ...props
}) => {
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  return (
    <BaseInput
      label={label}
      type={passwordShow ? "text" : "password"}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      feedback={feedback}
      isInvalid={!!feedback}
      {...props}
      suffix={
        suffix && (
          <Button
            variant="light"
            className="btn"
            onClick={() => setPasswordShow(!passwordShow)}
          >
            <i
              className={`${
                passwordShow ? "ri-eye-line" : "ri-eye-off-line"
              } align-middle`}
              aria-hidden="true"
            ></i>
          </Button>
        )
      }
    />
  );
};

export default BasePassword;
