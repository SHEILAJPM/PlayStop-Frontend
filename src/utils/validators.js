export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) =>
  password.length >= 8;

export const isValidPhone = (phone) =>
  /^\+?[0-9]{7,15}$/.test(phone);
