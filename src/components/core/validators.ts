// Function to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate if input is a number
export function isValidNumber(input: string): boolean {
  return !isNaN(Number(input));
}

// Function to validate if input is a non-empty array
export function isValidArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// Function to validate if input is a non-empty string
export function isValidString(input: string): boolean {
  return input.trim().length > 0;
}

// Function to validate if input length is within a specified range
export function isValidStringLength(
  input: string,
  minLength: number,
  maxLength: number
): boolean {
  const trimmedInput = input.trim();
  return trimmedInput.length >= minLength && trimmedInput.length <= maxLength;
}

// Function to check if a value is required (non-empty)
export function isRequired(value: any): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}
