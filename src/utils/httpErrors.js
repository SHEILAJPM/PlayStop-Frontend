export const HTTP_ERRORS = {
  400: 'Solicitud incorrecta. Verifica los datos enviados.',
  401: 'No autorizado. Por favor, inicia sesion nuevamente.',
  403: 'No tienes permiso para realizar esta accion.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Ya existe un registro con esos datos.',
  422: 'Los datos proporcionados no son validos.',
  500: 'Error interno del servidor. Intenta mas tarde.',
  503: 'El servicio no esta disponible. Intenta en unos minutos.',
};

export const getErrorMessage = (status) =>
  HTTP_ERRORS[status] ?? 'Ha ocurrido un error inesperado.';
