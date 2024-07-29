import React, { useState } from "react";
import {
  FloatingLabel,
  FloatingLabelProps,
  Form,
  InputGroup
} from "react-bootstrap";

interface FloatingLabelInputProps
  extends Omit<FloatingLabelProps, "prefix" | "suffix" | "name"> {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  feedback?: string;
  required?: boolean;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  name,
  onChange,
  feedback,
  required = false,
  prefix,
  suffix,
  onFocus,
  ...props
}) => {
  const defaultFeedbacks =
    required && !feedback ? `The ${name} field is required` : feedback;

  const [isFocused, setIsFocused] = useState(false);

  // Default feedback message when field is required
  const defaultFeedback = `The ${label} field is required.`;

  // Handle internal focus event
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e); // Call the overridden onFocus event if provided
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Form.Group>
      <InputGroup hasValidation>
        {prefix && (
          <InputGroup.Text id={`${props.id}GroupPrepend`}>
            {prefix}
          </InputGroup.Text>
        )}
        <FloatingLabel label={label} controlId={name}>
          <Form.Control
            {...props}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={
              prefix
                ? `${name}GroupPrepend`
                : suffix
                ? `${name}GroupAppend`
                : undefined
            }
            required={required}
            isInvalid={required && !!feedback && !isFocused}
          />
        </FloatingLabel>
        {suffix && (
          <InputGroup.Text id={`${name}GroupAppend`}>{suffix}</InputGroup.Text>
        )}
      </InputGroup>
      {(isFocused || defaultFeedbacks) && required && (
        <Form.Text className="text-danger">{defaultFeedback}</Form.Text>
      )}
    </Form.Group>
  );
};

export default FloatingLabelInput;
