const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function isValidFullName(value: string) {
  return value.length >= 2 && value.length <= 100;
}

export function isValidPassword(value: string) {
  return value.length >= 8 && value.length <= 128;
}

export function isValidCompanyName(value: string) {
  return (
    value.length >= 2 &&
    value.length <= 120 &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}
