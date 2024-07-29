import React from "react";
import Form from "react-bootstrap/Form";
import { FormCheckProps } from "react-bootstrap/FormCheck";

interface CheckboxProps extends Omit<FormCheckProps, "type" | "onChange"> {
  type?: "checkbox" | "switch";
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  feedback?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  type = "checkbox",
  label,
  checked,
  onChange,
  disabled,
  feedback,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Form.Group>
      <Form.Check
        {...props}
        type={type}
        label={label}
        checked={checked}
        onChange={handleChange}
        isInvalid={!!feedback}
        feedback={feedback}
      />
    </Form.Group>
  );
};

export default Checkbox;
