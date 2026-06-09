export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
  phone: /^\+?[0-9]{7,15}$/,
  onlyLetters: /^[a-zA-ZÃ€-Ã¿\s]+$/,
  onlyNumbers: /^[0-9]+$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};
