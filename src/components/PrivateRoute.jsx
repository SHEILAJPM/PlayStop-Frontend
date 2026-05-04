import 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, user, allowedRoles }) => { // Asegúrate de que los props se desestructuren correctamente
  // Si no hay usuario logueado, redirigir a la página de inicio/login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Normalizar el rol del usuario y los roles permitidos para la comparación
  // 'Super Admin' se convierte en 'superadmin' para coincidir con la URL (si usas rutas como /dashboard/superadmin)
  const normalizedUserRole = user.role.toLowerCase().replace(' ', '');
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase().replace(' ', ''));

  // Si el rol del usuario no está en la lista de roles permitidos para esta ruta
  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Redirigir al usuario a su propio dashboard si intenta acceder a uno que no le corresponde
    // Esto evita que, por ejemplo, un jugador acceda al panel de administrador.
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está correcto, renderizar el componente hijo (la vista protegida)
  return children;
};

export default PrivateRoute;