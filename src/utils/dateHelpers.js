export const today = () => new Date().toISOString().split('T')[0];

export const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const isDateInPast = (dateStr) => new Date(dateStr) < new Date();

export const getDayName = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'long' });

export const getWeekDates = (startDate) =>
  Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
