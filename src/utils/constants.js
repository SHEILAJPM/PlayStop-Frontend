export const APP_NAME = 'PlayStop';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Plataforma de reserva de canchas deportivas';

export const ROLES = {
  JUGADOR: 'USER',
  PROPIETARIO: 'OWNER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER ADMIN',
};

export const DEPORTES = [
  'Futbol', 'Padel', 'Tenis', 'Basketball', 'Volleyball', 'Squash', 'Badminton',
];

export const DURACIONES_MINUTOS = [30, 60, 90, 120];

export const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDING',
  CONFIRMADA: 'CONFIRMED',
  CANCELADA: 'CANCELLED',
  COMPLETADA: 'COMPLETED',
};

export const TOKEN_KEY = 'token';
export const USER_KEY = 'playstop-user';
export const THEME_KEY = 'playstop-theme';
