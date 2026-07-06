# PlayStop Frontend

> Plataforma de reservas deportivas — Interfaz de usuario

Aplicación web moderna para descubrir, comparar y reservar canchas deportivas en Perú.
Soporta múltiples roles: Jugador, Propietario de Club, Administrador y Super Admin.

## Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| JavaScript (JSX) | — | Lenguaje principal, sin TypeScript |
| React | 19.2 | Framework UI |
| Vite | 8.0 | Build tool y dev server |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Bootstrap Icons | 5.3 | Iconografía |
| Framer Motion | 12.38 | Animaciones |
| React Router DOM | 7.14 | Navegación SPA |
| Fetch API nativo | — | Cliente HTTP (`src/services/api.js`, sin Axios) |
| Leaflet / React Leaflet | — | Mapas interactivos |
| Capacitor | 8.4 | Empaquetado a app Android |

## Requisitos previos

- **Node.js 18+** y **npm 9+**
- Backend de PlayStop corriendo (local o desplegado) — ver el README de [PlayStop-Backend](https://github.com/SHEILAJPM/PlayStop-Backend)

## Cómo clonar y ejecutar en local

```bash
git clone https://github.com/SHEILAJPM/PlayStop-Frontend.git
cd PlayStop-Frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Por defecto usa las variables de `.env.development` (ver abajo).

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
- **Reserva en 2 minutos** — selección de horario, pago con Stripe Checkout y confirmación por QR
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

Vite carga automáticamente `.env.development` en `npm run dev` y `.env.production` en `npm run build`. Ya existen ambos archivos en el repo (no son secretos, apuntan a URLs públicas); normalmente no necesitas crear nada nuevo, solo editarlos si cambia la URL del backend.

| Variable | Obligatoria | Para qué sirve | Dónde conseguirla |
|---|---|---|---|
| `VITE_API_URL` | Sí | URL del backend al que llama la app | La URL de tu `PlayStop-Backend` corriendo (local: `http://localhost:8080`, o la de Render en producción) |
| `VITE_APP_NAME` | No | Nombre mostrado en la app | Texto libre |
| `VITE_ENV` | No | `development` / `production`, solo informativo | — |
| `VITE_DEBUG` | No | Muestra logs extra en consola | `true` / `false` |
| `VITE_SSE_ENABLED` | No | Activa notificaciones en tiempo real (Server-Sent Events) | Solo si el backend ya expone `GET /api/notifications/stream` |
| `VITE_FIREBASE_VAPID_KEY` | No | Notificaciones push del navegador | Firebase Console → tu proyecto → Configuración del proyecto → **Cloud Messaging** → "Certificados push web" |

**Nota sobre pagos:** no hace falta ninguna clave de Stripe aquí — el frontend solo pide al backend una URL de Checkout y redirige (`window.location.href`), toda la integración con Stripe vive en `PlayStop-Backend`.

```env
# .env.development (ejemplo)
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=PlayStop
VITE_ENV=development
VITE_DEBUG=true
```

---
Desarrollado por Sheila JPM | PlayStop 2026
