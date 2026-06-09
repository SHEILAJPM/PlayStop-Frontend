# Registro de cambios - PlayStop Frontend

## [1.0.0] - 2026-06-08 - Version inicial estable

### Correcciones incluidas
- Correccion de redireccionamiento tras login por rol de usuario
- Correccion de persistencia de sesion al recargar la pagina
- Correccion de estilos en modo oscuro en Safari
- Mejora de rendimiento en componentes con React.memo

### Seguridad
- Rutas protegidas con verificacion de token JWT
- Cierre de sesion automatico al expirar el token
- Validacion de formularios en cliente
