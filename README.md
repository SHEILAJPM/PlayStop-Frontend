# PlayStop - Frontend 🎮

PlayStop es un ecosistema digital robusto y escalable diseñado para digitalizar el ciclo completo de búsqueda, comparación y reserva de infraestructuras deportivas. Nuestro objetivo es erradicar las barreras de informalidad y garantizar una experiencia de usuario optimizada, transparente y de alto valor tecnológico tanto para jugadores como para administradores de clubes.

## 🚀 Características Principales

*   **Búsqueda Inteligente:** Selector interactivo de deportes, ciudades y distritos (con lógica dependiente).
*   **Diseño Moderno (SaaS):** Landing page responsiva con animaciones suaves, glassmorphism y transiciones de imágenes infinitas (efecto Ken Burns).
*   **Múltiples Vistas:** Secciones dedicadas para Jugadores, Clubes (Dashboards simulados) y Planes de Precios.
*   **Autenticación:** Ventanas modales (Pop-ups) integradas para el inicio de sesión y registro de usuarios.
*   **Rutas Protegidas:** Implementación de rutas privadas para controlar el acceso de usuarios según su rol.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack moderno de desarrollo frontend para ofrecer una experiencia rápida y eficiente.

*   **Librería Principal:** [React](https://react.dev/) (v19) - Para construir la interfaz de usuario.
*   **Empaquetador/Servidor:** [Vite](https://vitejs.dev/) - Un bundler rápido y optimizado para desarrollo frontend.
*   **Enrutamiento:** [React Router DOM](https://reactrouter.com/en/main) - Para la navegación declarativa entre componentes.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Un framework CSS utility-first para estilos rápidos y personalizables.
*   **Lenguaje:** JavaScript (ES6+)
*   **Otras Librerías Clave:**
    *   `react-dom`: El punto de entrada al DOM para React.
    *   `@vitejs/plugin-react`: Plugin para Vite que habilita el soporte de React.

## 📦 Dependencias Instaladas

A continuación se listan las principales dependencias del proyecto. Para la lista completa y sus versiones exactas, consulta el archivo `package.json`.

### Dependencias de Producción (`dependencies`)

*   `react`: `^19.0.0-rc-0` (o la versión específica utilizada)
*   `react-dom`: `^19.0.0-rc-0` (o la versión específica utilizada)
*   `react-router-dom`: `^6.X.X` (versión para enrutamiento)
*   `tailwindcss`: `^X.X.X` (versión de Tailwind CSS)
*   `autoprefixer`: `^X.X.X` (para compatibilidad de CSS)
*   `postcss`: `^X.X.X` (para procesar CSS con PostCSS)
*   *(Posibles otras dependencias específicas de UI o utilidades)*

### Dependencias de Desarrollo (`devDependencies`)

*   `@vitejs/plugin-react`: `^X.X.X` (plugin de Vite para React)
*   `eslint`: `^X.X.X` (para linting de código)
*   `prettier`: `^X.X.X` (para formateo de código)
*   `@types/react`: `^X.X.X` (tipos para React, si se usa TypeScript)
*   `@types/react-dom`: `^X.X.X` (tipos para React DOM, si se usa TypeScript)
*   `vite`: `^X.X.X` (el propio Vite como dev dependency)
*   *(Posibles otras herramientas de testing o desarrollo)*

## ⚙️ Instalación y Ejecución Local

Sigue estos pasos para poner en marcha el proyecto en tu entorno de desarrollo local.

1.  **Clonar el repositorio:**
    Abre tu terminal y ejecuta el siguiente comando:
    ```bash
    git clone https://github.com/tu-usuario/PlayStop-Frontend.git # Reemplaza con la URL real de tu repositorio
    cd PlayStop-Frontend
    ```
    Si ya tienes el repositorio clonado, simplemente navega a la carpeta del proyecto:
   ```bash
   cd PlayStop-Frontend
   ```

2.  **Instalar las dependencias:**
    Asegúrate de tener [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) (o Yarn, si lo prefieres) instalados en tu sistema. Luego, instala todas las dependencias del proyecto:
   ```bash
   npm install
    # o si usas Yarn:
    # yarn install
   ```

3.  **Configuración de Variables de Entorno (Opcional):**
    Si tu proyecto utiliza variables de entorno (por ejemplo, para APIs o credenciales), crea un archivo `.env` en la raíz del proyecto y configura las variables necesarias. Por ejemplo:
    ```
    VITE_API_URL=http://localhost:3000/api
    # Agrega aquí cualquier otra variable de entorno necesaria.
    ```
    *Nota: Para Vite, las variables de entorno deben prefijarse con `VITE_` para ser expuestas al código cliente.*

4.  **Iniciar el servidor de desarrollo:**
    Una vez instaladas las dependencias, puedes iniciar el servidor de desarrollo. Esto compilará el proyecto y lo servirá en tu navegador, con recarga en caliente (Hot Module Replacement):
   ```bash
   npm run dev
    # o si usas Yarn:
    # yarn dev
   ```

5.  **Acceder a la aplicación:**
    Abre tu navegador web y visita la dirección `http://localhost:5173/` (o el puerto que indique la consola si es diferente) para ver la aplicación en funcionamiento.

## 🚀 Despliegue (Build para Producción)

Para generar una versión optimizada del proyecto lista para despliegue en producción:

```bash
npm run build
# o si usas Yarn:
# yarn build
```
Esto creará una carpeta `dist` con los archivos estáticos listos para ser servidos por cualquier servidor web.

## 🤝 Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1.  Haz un "fork" del repositorio.
2.  Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y asegúrate de que pasen los tests (si existen).
4.  Haz "commit" de tus cambios (`git commit -m 'feat: Añadir nueva funcionalidad X'`).
5.  Sube tu rama (`git push origin feature/nueva-funcionalidad`).
6.  Abre un "Pull Request" a la rama `main` de este repositorio.
