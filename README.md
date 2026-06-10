# PlayStop Frontend

> Plataforma de reservas deportivas — Interfaz de usuario

Aplicación web moderna para descubrir, comparar y reservar canchas deportivas en Perú.
Soporta múltiples roles: Jugador, Propietario de Club, Administrador y Super Admin.

## Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2.5 | Framework UI |
| Vite | 8.0 | Build tool |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Bootstrap | 5.3 | Componentes y grid |
| Framer Motion | 12.38 | Animaciones |
| React Router DOM | 7.14 | Navegación SPA |
| Axios | — | Cliente HTTP |
| Leaflet | — | Mapas interactivos |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 5173) |
| `npm run build` | Compilación para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Verificación de calidad de código |

## Estructura del proyecto

```
src/
├── components/
│   ├── Hero.jsx                     # Hero con búsqueda y widget glassmorphism
│   ├── Navbar.jsx                   # Navegación sticky con toggle de tema
│   ├── CanchasDestacadas.jsx        # Carrusel infinito de canchas (dark theme)
│   ├── Soluciones.jsx               # Sección dual jugadores / clubes
│   ├── ParaJugadores.jsx            # Mockup animado de la app móvil
│   ├── ParaClubes.jsx               # Dashboard demo para propietarios
│   ├── Testimonios.jsx              # Carrusel de reseñas con parallax
│   ├── Precios.jsx                  # Planes Básico / Pro / Enterprise
│   ├── Faq.jsx                      # Preguntas frecuentes con acordeón
│   ├── Blog.jsx                     # Artículos y noticias del sector
│   ├── Contacto.jsx                 # Formulario de contacto
│   ├── Footer.jsx                   # Footer con links y redes sociales
│   ├── ComparadorCanchas.jsx        # Comparador lado a lado de canchas
│   ├── ChatBot.jsx                  # Asistente virtual integrado
│   ├── Login.jsx                    # Login + recuperación de contraseña
│   ├── Register.jsx                 # Registro de usuarios
│   ├── Legal.jsx                    # Términos y política de privacidad
│   ├── onboarding/
│   │   └── OnboardingTour.jsx       # Tour guiado de bienvenida por rol
│   └── dashboards/
│       ├── DashboardLayout.jsx      # Layout compartido + MetricCard + Skeletons
│       ├── JugadorDashboard.jsx     # Reservas, logros, amigos, referidos
│       ├── PropietarioDashboard.jsx # Canchas, ingresos, calendario
│       ├── AdminDashboard.jsx       # Panel de administración general
│       ├── SuperAdminDashboard.jsx  # Controles de super administrador
│       └── CalendarioCancha.jsx     # Calendario de disponibilidad por cancha
├── pages/
│   ├── BookingFlow.jsx              # Flujo completo reserva → pago → QR
│   ├── CourtPublicPage.jsx          # Página pública de detalle de cancha
│   ├── MapaCanchas.jsx              # Mapa interactivo con geolocalización
│   └── Matchmaking.jsx             # Buscar / crear partidos abiertos
├── context/
│   ├── AuthContext.jsx              # Estado global de autenticación
│   └── ThemeContext.jsx             # Estado global de tema claro / oscuro
├── hooks/
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useNotifications.js
│   └── useOnboarding.js
├── services/
│   └── api.js                       # Cliente Axios con 50+ endpoints
└── index.css                        # Tokens de diseño globales
```

## Funcionalidades principales

- **Búsqueda y filtros** — por deporte, ciudad, distrito, precio y disponibilidad
- **Reserva en 2 minutos** — selección de horario, pago con Culqi y confirmación por QR
- **Mapa interactivo** — canchas cercanas con geolocalización en tiempo real
- **Matchmaking** — crea o únete a partidos abiertos por deporte y zona
- **Comparador** — compara hasta 3 canchas lado a lado
- **Sistema de puntos** — logros y recompensas por reservas frecuentes
- **Referidos** — código personal con beneficios para invitados y referidor
- **Dashboards por rol** — vistas diferenciadas para cada tipo de usuario
- **Modo oscuro / claro** — toggle persistente en toda la aplicación
- **PWA** — instalable en dispositivos móviles

## Diseño

- Tema oscuro como base con soporte completo de modo claro
- Glassmorphism en widgets y cards interactivas
- Paleta de marca: verde `#00d084`, slate oscuro `#030712` / `#0f172a`
- Tipografía: Inter (Google Fonts)
- Animaciones de entrada y micro-interacciones con Framer Motion

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

---
Desarrollado por Sheila JPM | PlayStop 2026
