import { getErrorMessage } from './httpErrors.js';

export const handleApiError = (error) => {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;
  return serverMessage || getErrorMessage(status) || 'Error de conexion con el servidor.';
};

export const buildQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');
  return query ? '?' + query : '';
};
