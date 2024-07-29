import React from "react";
import {
  FormControl,
  FormControlProps,
  FormGroup,
  FormLabel,
  FormText,
  InputGroup
} from "react-bootstrap";

interface FileInputProps extends FormControlProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  helpText?: string;
  size?: "sm" | "lg" | undefined;
  feedback?: string;
  suffix?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  accept,
  multiple,
  disabled,
  helpText,
  size = "sm",
  feedback,
  suffix,
  onChange,
  ...props
}) => {
  return (
    <FormGroup>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup hasValidation>
        <FormControl
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          size={size}
          onChange={onChange}
          {...props}
        />
        {feedback && (
          <FormControl.Feedback type="invalid">{feedback}</FormControl.Feedback>
        )}
        {suffix && (
          <InputGroup.Text id={`${props.id ?? label}fileAppend`}>
            {suffix}
          </InputGroup.Text>
        )}
      </InputGroup>
      {helpText && <FormText className="text-muted">{helpText}</FormText>}
    </FormGroup>
  );
};

export default FileInput;
