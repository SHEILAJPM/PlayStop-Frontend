export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

export const isValidPhone = (phone) =>
  /^\+?[0-9]{7,15}$/.test(phone);

export const isValidName = (name) =>
  name.trim().length >= 2 && name.trim().length <= 100;

export const passwordsMatch = (p1, p2) => p1 === p2;
