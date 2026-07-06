import { useState, useEffect, useRef } from 'react';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// ═══════════════════════════════════════════════════════════════════════════════
// BASE DE CONOCIMIENTO COMPLETA
// ═══════════════════════════════════════════════════════════════════════════════
const KB = [

  // ── SALUDOS ──────────────────────────────────────────────────────────────────
  {
    id: 'saludo',
    cat: '👋 General',
    kw: ['hola','buenas','buenos','hey','hi','hello','saludos','buen dia','buenas tardes','buenas noches','que tal','como estas','que hay'],
    ans: '¡Hola! Soy el asistente de **PlayStop** 🏆\n\nPuedo responderte sobre:\n• Reservas y pagos\n• Canchas y mapa\n• Matchmaking y torneos\n• Tu cuenta y perfil\n• Puntos, logros y amigos\n• Soporte técnico\n\n¿Sobre qué tema quieres saber?',
    fu: ['como-reservar','matchmaking','torneos','mi-cuenta'],
  },
  {
    id: 'gracias',
    cat: '👋 General',
    kw: ['gracias','muchas gracias','thanks','perfecto','genial','excelente','muy bien','todo claro','ya entendi','entendido','de acuerdo','listo'],
    ans: '¡Con mucho gusto! 😊 ¿Hay algo más en lo que te pueda ayudar?',
    fu: ['como-reservar','soporte','canchas'],
  },
  {
    id: 'adios',
    cat: '👋 General',
    kw: ['adios','chao','chau','hasta luego','nos vemos','bye','hasta pronto','cuidate'],
    ans: '¡Hasta luego! Que disfrutes tu partido. ⚽🏀🎾\n\nSi necesitas algo, aquí estaré.',
    fu: [],
  },
  {
    id: 'que-es-playstop',
    cat: '👋 General',
    kw: ['playstop','playspot','que es','qué es','como funciona','cómo funciona','para que sirve','para qué sirve','cuéntame sobre','de que trata','informacion general','acerca de'],
    ans: '**PlayStop** es la plataforma deportiva #1 del Perú 🇵🇪\n\n⚽ **Para jugadores** — Busca, reserva canchas y arma partidos en segundos.\n🏟️ **Para propietarios** — Gestiona tu complejo, cobra online y analiza ingresos.\n🏆 **Para competidores** — Únete a torneos y ligas organizadas.\n\n**Deportes**: Fútbol, Pádel, Tenis, Vóley, Básquet\n**Ciudades**: Lima y principales ciudades del Perú',
    fu: ['como-reservar','matchmaking','torneos','soy-propietario'],
  },

  // ── CUENTA Y PERFIL ──────────────────────────────────────────────────────────
  {
    id: 'mi-cuenta',
    cat: '👤 Cuenta',
    kw: ['mi cuenta','cuenta','perfil','mi perfil','configuracion','ajustes','editar perfil','datos personales'],
    ans: 'Desde **"Mi Perfil"** en tu dashboard puedes:\n• Cambiar nombre y foto de perfil\n• Actualizar tu correo\n• Cambiar contraseña\n• Ver tu historial de reservas\n• Configurar notificaciones\n\n¿Qué quieres hacer con tu cuenta?',
    fu: ['cambiar-foto','cambiar-contrasena','eliminar-cuenta','login'],
  },
  {
    id: 'registro',
    cat: '👤 Cuenta',
    kw: ['registrar','registro','crear cuenta','nueva cuenta','sign up','como me registro','cómo me registro','crear perfil','quiero registrarme','unirme','abrir cuenta'],
    ans: '**Crear tu cuenta PlayStop es gratis:**\n\n1. Toca **"Registrarse"** en la página principal\n2. Ingresa tu nombre, correo y contraseña\n3. Confirma tu correo con el código que recibes\n4. ¡Listo! Empieza a reservar\n\n💡 También puedes registrarte directamente con tu cuenta de **Google** en un clic.',
    fu: ['login','verificar-correo','google-login'],
  },
  {
    id: 'verificar-correo',
    cat: '👤 Cuenta',
    kw: ['verificar correo','verificacion correo','verificación correo','codigo verificacion','código verificación','no llego correo','no recibo correo','confirmar email','activar cuenta','correo activacion'],
    ans: 'Si no recibiste el correo de verificación:\n\n1. Revisa la carpeta de **Spam / Correo no deseado**\n2. Espera 2–3 minutos y vuelve a verificar\n3. Toca **"Reenviar código"** en la pantalla de verificación\n4. Verifica que escribiste bien tu correo\n\nSi el problema persiste: **soporte@playstop.pe**',
    fu: ['registro','login','soporte'],
  },
  {
    id: 'login',
    cat: '👤 Cuenta',
    kw: ['login','iniciar sesion','iniciar sesión','ingresar','no me deja entrar','no puedo logear','error al entrar','no puedo acceder','problema login','no puedo iniciar','acceder cuenta'],
    ans: '**Problemas para iniciar sesión:**\n\n1. Verifica que tu correo y contraseña sean correctos\n2. Activa **Bloq Mayús** — la contraseña es sensible a mayúsculas\n3. Usa **"¿Olvidaste tu contraseña?"** si no recuerdas\n4. Intenta en modo incógnito o en otro navegador\n5. Limpia caché y cookies del navegador\n\nSi persiste: **soporte@playstop.pe**',
    fu: ['cambiar-contrasena','google-login','soporte'],
  },
  {
    id: 'google-login',
    cat: '👤 Cuenta',
    kw: ['google','login google','iniciar con google','entrar con google','cuenta google','gmail login','google oauth','redes sociales','facebook login'],
    ans: '¡Sí! Puedes iniciar sesión y registrarte con **Google** directamente desde la pantalla de login.\n\n• Sin contraseña extra\n• En un solo clic\n• Usa tu cuenta de Gmail existente\n\n¡Es la forma más rápida de entrar a PlayStop!',
    fu: ['login','registro'],
  },
  {
    id: 'cambiar-contrasena',
    cat: '👤 Cuenta',
    kw: ['contraseña','contrasena','olvide mi contraseña','olvidé mi contraseña','recuperar contraseña','resetear contraseña','cambiar contraseña','nueva contraseña','forgot password','no recuerdo','no me acuerdo','recuperar acceso'],
    ans: '**¿Olvidaste tu contraseña?**\n\n1. Ve a la pantalla de inicio de sesión\n2. Toca **"¿Olvidaste tu contraseña?"**\n3. Ingresa tu correo electrónico\n4. Recibirás un código de recuperación\n5. Ingresa el código y crea una nueva contraseña\n\n**¿Quieres cambiarla estando dentro?**\nDashboard → Mi Perfil → Cambiar contraseña',
    fu: ['login','soporte'],
  },
  {
    id: 'cambiar-foto',
    cat: '👤 Cuenta',
    kw: ['foto perfil','cambiar foto','imagen perfil','avatar','foto de usuario','subir foto','foto cuenta'],
    ans: 'Para cambiar tu foto de perfil:\n\n1. Ve a tu **Dashboard**\n2. Entra a **"Mi Perfil"**\n3. Toca tu foto actual o el ícono de cámara\n4. Selecciona una imagen desde tu dispositivo\n5. Guarda los cambios\n\nFormatos aceptados: JPG, PNG, WebP (máx. 10MB)',
    fu: ['mi-cuenta'],
  },
  {
    id: 'eliminar-cuenta',
    cat: '👤 Cuenta',
    kw: ['eliminar cuenta','borrar cuenta','cancelar cuenta','dar de baja','cerrar cuenta','borrar mis datos','borrar perfil','darse de baja'],
    ans: 'Para eliminar tu cuenta:\n\n1. Ve a **Dashboard → Mi Perfil**\n2. Desplázate hasta la parte inferior\n3. Toca **"Eliminar mi cuenta"**\n4. Confirma con tu contraseña\n\n⚠️ **Importante**: Se eliminarán tus reservas, puntos y datos. Esta acción no se puede deshacer.\n\nSi tienes reservas futuras activas, primero cancélalas.',
    fu: ['cancelar','soporte'],
  },
  {
    id: 'cuenta-suspendida',
    cat: '👤 Cuenta',
    kw: ['suspendido','suspendida','cuenta bloqueada','bloqueado','ban','baneado','no puedo chatear','chat bloqueado','cuenta restringida'],
    ans: 'Si tu cuenta fue **suspendida del chat**, puede ser por:\n\n⚠️ Uso de lenguaje inapropiado en el chat\n\n**Escalada de moderación:**\n1. Advertencia (1ª vez)\n2. Suspensión 1 día\n3. Suspensión 5 días\n4. Bloqueo permanente\n\nPara apelar una suspensión, escribe a **soporte@playstop.pe** indicando tu usuario.',
    fu: ['soporte','chat-reserva'],
  },
  {
    id: 'roles',
    cat: '👤 Cuenta',
    kw: ['tipos de usuario','tipos de cuenta','jugador','propietario','admin','rol','roles','diferencia jugador propietario','cuenta jugador','cuenta propietario'],
    ans: 'PlayStop tiene 3 tipos de cuenta:\n\n⚽ **Jugador** — Busca y reserva canchas, arma partidos, compite en torneos.\n🏟️ **Propietario** — Gestiona complejos deportivos, canchas, reservas e ingresos.\n🛡️ **Administrador** — Gestión interna de la plataforma.\n\nPuedes registrarte como jugador o propietario desde la pantalla de registro.',
    fu: ['registro','soy-propietario'],
  },

  // ── RESERVAS ─────────────────────────────────────────────────────────────────
  {
    id: 'como-reservar',
    cat: '📅 Reservas',
    kw: ['como reservo','cómo reservo','como reservar','cómo reservar','hacer reserva','hacer una reserva','quiero reservar','reservar cancha','proceso reserva','pasos reserva','quiero hacer una reserva','como hago una reserva'],
    ans: '**Reservar una cancha en PlayStop:**\n\n1. 🔍 Ve a **"Buscar Canchas"** y filtra por deporte, distrito y precio\n2. 📸 Elige la cancha que más te guste\n3. 📅 Selecciona la **fecha** y el **horario** disponible\n4. 💳 Confirma y **paga online** (Yape, Plin, tarjeta, etc.)\n5. 📱 Recibes tu **código QR** al instante por correo y en la app\n\n¡Todo el proceso toma menos de 2 minutos!',
    fu: ['qr','metodos-pago','cancelar'],
  },
  {
    id: 'reservas',
    cat: '📅 Reservas',
    kw: ['reserva','reservas','mis reservas','ver reservas','historial reservas','estado reserva','reservas activas','donde veo mis reservas','consultar reserva'],
    ans: 'Tus reservas están en **Dashboard → "Mis Reservas"**.\n\nDesde ahí puedes:\n• Ver el estado: Confirmada / Pendiente / Asistió / Cancelada\n• Descargar tu **código QR** de acceso\n• **Chatear** con el propietario de la cancha\n• **Cancelar** si ya no puedes asistir\n• Ver el historial completo',
    fu: ['qr','cancelar','chat-reserva','confirmacion'],
  },
  {
    id: 'confirmacion',
    cat: '📅 Reservas',
    kw: ['confirmacion','confirmación','confirmo','confirmar reserva','recibo','comprobante','voucher','constancia','ya pague','pague y no confirma'],
    ans: 'Al confirmar tu reserva recibes:\n\n📧 **Correo de confirmación** con todos los detalles\n📱 **Código QR** para acceder a la cancha\n🔔 **Recordatorio** por notificación 1 hora antes\n\n¿No llegó el correo?\n• Revisa la carpeta de **Spam**\n• Espera hasta 5 minutos\n• Verifica que tu correo esté bien escrito en tu perfil',
    fu: ['qr','notificaciones','reservas'],
  },
  {
    id: 'cancelar',
    cat: '📅 Reservas',
    kw: ['cancelar','cancelación','cancelacion','anular','cancelar reserva','como cancelo','cómo cancelo','cancelar mi reserva','quiero cancelar','no puedo ir'],
    ans: '**Cancelar una reserva:**\n\nDashboard → Mis Reservas → "Cancelar"\n\n**Política de reembolso:**\n✅ **100%** → Cancelas con **24h o más** de anticipación (gratis)\n⚠️ **50%** → Cancelas con **menos de 24h**\n❌ **0%** → No cancelas y no asistes\n🔄 **100%** → El propietario cancela → reembolso automático total\n\nEl reembolso tarda **1–3 días hábiles** según tu método de pago.',
    fu: ['reembolso','politica-cancelacion','reservas'],
  },
  {
    id: 'reembolso',
    cat: '📅 Reservas',
    kw: ['reembolso','devolucion','devolución','me devuelven','cuando me devuelven','plazo devolucion','cuanto demora devolucion','reintegro','como recibo mi dinero'],
    ans: '**Proceso de reembolso:**\n\n• **Tarjeta de crédito/débito**: 3–5 días hábiles\n• **Yape / Plin**: 24–48 horas\n• **Efectivo**: se coordina con el propietario\n\n📩 Recibirás un correo de confirmación cuando se procese el reembolso.\n\n¿No llegó en el plazo? Contacta a **soporte@playstop.pe** con el número de tu reserva.',
    fu: ['cancelar','soporte','metodos-pago'],
  },
  {
    id: 'reprogramar',
    cat: '📅 Reservas',
    kw: ['reprogramar','cambiar fecha','cambiar horario','mover reserva','cambiar reserva','otra fecha','otro dia','otro día','cambiar dia','cambiar hora'],
    ans: 'Por el momento la **reprogramación directa** está en desarrollo.\n\nMientras tanto:\n1. **Cancela** tu reserva actual (gratis si es con 24h+ de anticipación)\n2. **Haz una nueva reserva** con la fecha y horario que prefieras\n\n💡 Tip: Cancela lo antes posible para asegurar el horario alternativo.',
    fu: ['cancelar','como-reservar'],
  },
  {
    id: 'qr',
    cat: '📅 Reservas',
    kw: ['qr','codigo qr','código qr','codigo de entrada','código de entrada','acceso','entrada','ticket','ver qr','mostrar qr','donde esta mi qr','descargar qr'],
    ans: 'Tu **código QR** se genera automáticamente al confirmar la reserva.\n\n📍 **Dónde encontrarlo:**\n• Dashboard → Mis Reservas → botón **"Ver QR"**\n• También te lo enviamos por **correo electrónico**\n• Guarda la imagen para mostrarla offline\n\nEl propietario lo escanea con su celular. ¡En segundos te da acceso!',
    fu: ['reservas','como-reservar','confirmacion'],
  },
  {
    id: 'no-asistencia',
    cat: '📅 Reservas',
    kw: ['no asisti','no fui','no pude ir','no me presenté','no me presente','fui tarde','llegue tarde','no asistio','no se presento','ausente','inasistencia'],
    ans: 'Si **no asististe** a una reserva y no cancelaste:\n\n• La reserva queda como **"No asistió"** en tu historial\n• No hay reembolso (política de cancelación tardía)\n• No afecta tu cuenta, pero sí tu historial de asistencia\n\n💡 Para evitarlo: Cancela con al menos **24 horas de anticipación** desde "Mis Reservas".',
    fu: ['cancelar','estadisticas'],
  },
  {
    id: 'comprobante',
    cat: '📅 Reservas',
    kw: ['boleta','factura','comprobante pago','recibo pago','comprobante fiscal','constancia pago','descarga comprobante','pdf reserva'],
    ans: 'Para obtener tu comprobante de pago:\n\n1. Dashboard → **Mis Reservas**\n2. Selecciona la reserva que quieras\n3. Toca **"Descargar comprobante"**\n\nEl comprobante incluye: fecha, cancha, monto pagado y número de transacción.\n\n¿Necesitas factura con RUC? Escríbenos a **soporte@playstop.pe**',
    fu: ['reservas','soporte'],
  },
  {
    id: 'reserva-grupal',
    cat: '📅 Reservas',
    kw: ['reserva grupal','reservar para varios','reservar para mi equipo','reservar para grupo','reservar para amigos','reservar para muchos','grupo'],
    ans: '¡Sí puedes reservar para todo tu grupo!\n\nOpciones:\n\n1. **Reserva normal** → Una persona paga todo y coordina por WhatsApp\n2. **Pago dividido** → Cada uno paga su parte desde la app (disponible en Matchmaking)\n3. **Crear partido** → En Matchmaking, armas el partido y los demás se unen y pagan solos\n\n¿Cuántos son en el grupo?',
    fu: ['pago-dividido','matchmaking','como-reservar'],
  },

  // ── PAGOS ────────────────────────────────────────────────────────────────────
  {
    id: 'precios-canchas',
    cat: '💰 Precios',
    kw: ['precio','precios','costo','costos','cuanto cuesta','cuánto cuesta','cuanto cobran','tarifa','tarifas','valor','cuanto sale','precio cancha','cuanto es'],
    ans: '**Precios en PlayStop:**\n\n⚽ Para jugadores: **buscar y reservar es GRATIS**. Solo pagas el alquiler de la cancha al propietario.\n\nLos precios varían según la cancha:\n• Fútbol 5 → desde **S/ 60–120/hora**\n• Pádel → desde **S/ 40–80/hora**\n• Tenis → desde **S/ 30–70/hora**\n• Vóley/Básquet → desde **S/ 40–80/hora**\n\nUsa los filtros del mapa para buscar por precio.',
    fu: ['metodos-pago','pago-dividido','planes'],
  },
  {
    id: 'metodos-pago',
    cat: '💰 Precios',
    kw: ['metodo pago','método pago','medios de pago','como pago','cómo pago','pagar con','yape','plin','tarjeta','efectivo','visa','mastercard','transferencia','billetera digital','pago online'],
    ans: '**Métodos de pago aceptados en PlayStop:**\n\n📱 **Yape** (instantáneo)\n📱 **Plin** (instantáneo)\n💳 **Tarjeta de crédito/débito** (Visa, Mastercard)\n💵 **Efectivo** en cancha (al llegar)\n\nTodos los pagos online están protegidos con **cifrado SSL**.',
    fu: ['precios-canchas','pago-dividido','seguridad-pago'],
  },
  {
    id: 'pago-dividido',
    cat: '💰 Precios',
    kw: ['pago dividido','dividir pago','split','entre amigos','entre varios','compartir pago','pagar entre todos','pagar en grupo','juntamos para pagar','cada uno paga','su parte'],
    ans: '**Pago dividido en PlayStop 🤝**\n\nAl unirte a un partido en **Matchmaking**, puedes elegir pagar con:\n• 📱 Yape\n• 📱 Plin\n• 💳 Tarjeta\n• 💵 Efectivo (al llegar)\n\nCada jugador paga solo su parte proporcional. ¡Nada de deudas ni collectas incómodas!',
    fu: ['matchmaking','metodos-pago'],
  },
  {
    id: 'seguridad-pago',
    cat: '💰 Precios',
    kw: ['seguro pago','es seguro pagar','seguridad pago','proteccion datos tarjeta','fraude','estafa','datos tarjeta','robar datos','confiable'],
    ans: '**Tus pagos están 100% seguros** 🔐\n\n• Cifrado **SSL/TLS** en todas las transacciones\n• No almacenamos datos de tarjetas (estándar **PCI-DSS**)\n• Pagos procesados por pasarelas certificadas\n• Si detectamos actividad sospechosa, bloqueamos la transacción\n\nPlayStop nunca te pedirá datos de pago por chat o correo.',
    fu: ['metodos-pago','soporte'],
  },
  {
    id: 'pago-fallido',
    cat: '💰 Precios',
    kw: ['pago fallido','no se proceso el pago','error al pagar','no pudo pagar','rechazado','declinado','tarjeta rechazada','no acepta mi tarjeta','problema al pagar'],
    ans: 'Si tu pago fue rechazado:\n\n1. Verifica que los datos de la tarjeta sean correctos\n2. Asegúrate de tener **saldo suficiente**\n3. Contacta a tu banco — algunos bloquean pagos online por defecto\n4. Intenta con otro método (Yape, Plin, otra tarjeta)\n5. Desactiva el bloqueador de popups del navegador\n\n¿Sigue fallando? **soporte@playstop.pe**',
    fu: ['metodos-pago','soporte'],
  },
  {
    id: 'planes',
    cat: '💰 Precios',
    kw: ['plan','planes','suscripción','suscripcion','mensual','plan pro','plan basico','plan básico','propietario plan','precio propietario','cuanto paga propietario'],
    ans: '**Planes para propietarios:**\n\n🟢 **Básico** (gratis):\n• 0 costo de afiliación\n• Comisión por reserva exitosa\n• Gestión de canchas y reservas\n• QR de acceso\n\n⭐ **PRO** (cuota mensual):\n• Todo lo de Básico\n• Analíticas avanzadas + exportar CSV\n• Torneos y ligas\n• Gestión de tienda\n• Soporte prioritario\n• Sin límite de canchas\n\n**Para jugadores: siempre GRATIS** ✅',
    fu: ['soy-propietario','torneos','analiticas'],
  },
  {
    id: 'ingresos-propietario',
    cat: '💰 Precios',
    kw: ['ingresos','cobro propietario','recibir dinero','deposito','depósito','pago propietario','cuando me pagan','plazo pago propietario','transferencia propietario','mis ganancias'],
    ans: 'Los propietarios reciben sus ingresos **24–48 horas hábiles** tras cada reserva exitosa.\n\nVía transferencia bancaria a tu cuenta registrada.\n\n📊 Desde **Dashboard → Finanzas** puedes:\n• Ver ingresos en tiempo real\n• Descargar reportes CSV por mes\n• Ver el detalle de cada transacción\n• Analizar ingresos por cancha',
    fu: ['analiticas','soporte'],
  },

  // ── CANCHAS ───────────────────────────────────────────────────────────────────
  {
    id: 'canchas',
    cat: '🏟️ Canchas',
    kw: ['cancha','canchas','buscar cancha','encontrar cancha','ver canchas','disponible','disponibles'],
    ans: 'Para encontrar la cancha ideal:\n\n🔍 **Filtros disponibles:**\n• **Deporte**: Fútbol, Pádel, Tenis, Vóley, Básquet\n• **Distrito**: Todos los distritos de Lima\n• **Precio máximo** por hora\n• **Calificación** mínima\n\n📍 Puedes ver las canchas en el **mapa interactivo** o en lista con fotos y reseñas.',
    fu: ['mapa','deportes','como-reservar','filtros'],
  },
  {
    id: 'deportes',
    cat: '🏟️ Canchas',
    kw: ['futbol','fútbol','padel','pádel','tenis','voley','vóley','basquet','básquet','deporte','deportes','tipo cancha','que deportes','que canchas hay'],
    ans: 'PlayStop tiene canchas de **5 deportes**:\n\n⚽ **Fútbol** — Grass, sintético, F5, F7, F11\n🎾 **Pádel** — Cristal y muro\n🎾 **Tenis** — Arcilla, dura y sintética\n🏐 **Vóley** — Sala y playa\n🏀 **Básquet** — Parquet y asfalto\n\nUsa el filtro de deporte al buscar canchas.',
    fu: ['canchas','mapa','como-reservar'],
  },
  {
    id: 'filtros',
    cat: '🏟️ Canchas',
    kw: ['filtrar','filtros','como filtrar','buscar por precio','buscar por distrito','buscar por deporte','ordenar canchas','criterios busqueda'],
    ans: '**Filtros disponibles en PlayStop:**\n\n• 🏅 **Deporte** (Fútbol, Pádel, Tenis, Vóley, Básquet)\n• 📍 **Distrito** (todos los de Lima)\n• 💰 **Precio máximo** por hora\n• ⭐ **Calificación** mínima\n\nPuedes combinar todos los filtros. Los resultados se actualizan en el mapa y en lista automáticamente.',
    fu: ['mapa','canchas','como-reservar'],
  },
  {
    id: 'mapa',
    cat: '🏟️ Canchas',
    kw: ['mapa','ver mapa','mapa canchas','ubicacion','ubicación','cerca','cerca de mi','cancha cercana','donde esta','dónde está','mapa interactivo'],
    ans: 'El **mapa interactivo de PlayStop** te permite:\n\n🗺️ Ver todas las canchas disponibles en Lima\n📍 Ubicar la cancha más cercana a ti\n🔍 Filtrar por deporte, distrito y precio directamente en el mapa\n⚽ Reservar directamente desde el mapa\n\nAccede desde el menú principal → **"Mapa de Canchas"**',
    fu: ['canchas','filtros','como-reservar'],
  },
  {
    id: 'favoritas',
    cat: '🏟️ Canchas',
    kw: ['favoritos','favorita','guardar cancha','cancha favorita','lista favoritas','corazon','guardadas','mis favoritas'],
    ans: 'Puedes guardar tus canchas favoritas para reservarlas más rápido:\n\n1. En cualquier tarjeta de cancha, toca el **❤️**\n2. La cancha queda guardada en **"Mis Favoritas"**\n3. Accede desde tu **Dashboard → Canchas Favoritas**\n\n¡Ideal para tus canchas habituales!',
    fu: ['canchas','como-reservar'],
  },
  {
    id: 'comparador',
    cat: '🏟️ Canchas',
    kw: ['comparar canchas','comparador','comparar','que cancha es mejor','diferencia entre canchas','cual es mejor cancha','elegir cancha'],
    ans: '**Comparador de canchas en PlayStop:**\n\n1. Al ver canchas en la lista, toca **"Comparar"** en las que te interesen (hasta 3)\n2. Aparece una barra de comparación en la parte inferior\n3. Ver lado a lado: precio, calificación, deporte, distrito\n\nTe ayuda a elegir la mejor opción según tu presupuesto y ubicación.',
    fu: ['canchas','reseñas','mapa'],
  },
  {
    id: 'reseñas',
    cat: '🏟️ Canchas',
    kw: ['reseña','reseñas','opinion','opinión','calificacion','calificación','rating','estrella','estrellas','comentario','comentarios','nota','dejar reseña','poner nota','como califico'],
    ans: '**Reseñas en PlayStop:**\n\nLas reseñas son de **jugadores reales** que han reservado la cancha.\n\n⭐ **Para dejar tu reseña:**\n1. Entra a la página de la cancha\n2. Desplázate a la sección de reseñas\n3. Elige tu puntuación (1–5 estrellas)\n4. Escribe tu opinión detallada\n5. Publica — aparece inmediatamente\n\n¡Tu opinión ayuda a toda la comunidad!',
    fu: ['canchas','reservas'],
  },
  {
    id: 'implementos',
    cat: '🏟️ Canchas',
    kw: ['pelota','balón','balon','implementos','hay balones','prestamos','tienen pelotas','hay duchas','estacionamiento','vestuario','ducha','parking','camarines','luces','iluminacion','techo','techada'],
    ans: 'Los servicios disponibles (duchas, implementos, iluminación, estacionamiento) **varían por cada cancha**.\n\n📸 **Cómo saberlo:**\n• Lee la descripción completa de la cancha en su página\n• Revisa las **fotos** y **reseñas** de otros jugadores\n• Usa el **chat con el propietario** antes de reservar para preguntar\n\n¡Los propietarios responden rápido!',
    fu: ['chat-reserva','reseñas','canchas'],
  },
  {
    id: 'horarios',
    cat: '🏟️ Canchas',
    kw: ['horarios','horario','horario de atencion','abre','cierra','que horas','a que hora','horario disponible','cuando abre','turno mañana','turno tarde','turno noche','noche'],
    ans: 'Los horarios de cada cancha son **configurados por el propietario** y pueden variar.\n\n📅 Al seleccionar una cancha y fecha, verás solo los **horarios disponibles** para reservar.\n\nGeneralmente las canchas atienden:\n• 🌅 Mañana: 6am – 12pm\n• ☀️ Tarde: 12pm – 6pm\n• 🌙 Noche: 6pm – 11pm\n\nSi una hora no aparece, ya está reservada o fuera del horario del propietario.',
    fu: ['como-reservar','canchas'],
  },

  // ── MATCHMAKING ────────────────────────────────────────────────────────────
  {
    id: 'matchmaking',
    cat: '⚽ Matchmaking',
    kw: ['matchmaking','partido','armar partido','busco jugadores','necesito jugadores','encontrar jugadores','partido abierto','busco equipo','completar equipo','armar equipo','juntarse jugar','quiero jugar con gente','compañeros','faltan jugadores'],
    ans: '**Matchmaking de PlayStop** — Arma o únete a partidos ⚽🏀\n\n📌 **Crear un partido:**\n1. Elige deporte, cancha y fecha\n2. Define cuántos jugadores necesitas\n3. Los jugadores del área se unen solos\n\n👥 **Unirte a un partido:**\n1. Filtra por deporte y distrito\n2. Ve los partidos con cupos disponibles\n3. Paga tu parte y ¡listo!\n\nTambién tienes un **chat grupal** para coordinar con tu equipo.',
    fu: ['matchmaking-unirse','matchmaking-crear','pago-dividido','matchmaking-chat'],
  },
  {
    id: 'matchmaking-crear',
    cat: '⚽ Matchmaking',
    kw: ['crear partido','armar partido','organizar partido','como creo partido','cómo creo un partido','nuevo partido','publicar partido'],
    ans: '**Cómo crear un partido en Matchmaking:**\n\n1. Ve a **Matchmaking** en el menú\n2. Toca **"+ Crear partido"**\n3. Selecciona: deporte, cancha, fecha, hora\n4. Define el número de jugadores que necesitas\n5. Publica — los jugadores verán tu partido y podrán unirse\n\nEl partido se confirma cuando se complete el equipo o llega la hora acordada.',
    fu: ['matchmaking','matchmaking-chat','pago-dividido'],
  },
  {
    id: 'matchmaking-unirse',
    cat: '⚽ Matchmaking',
    kw: ['unirme partido','unirme a un partido','como me uno','cómo me uno','ver partidos','partidos disponibles','partidos abiertos','quiero unirme','busco partido'],
    ans: '**Cómo unirte a un partido:**\n\n1. Ve a **Matchmaking** en el menú\n2. Filtra por deporte y/o distrito\n3. Verás partidos con cupos disponibles\n4. Toca el partido y revisa los detalles\n5. Toca **"Unirme"** y elige método de pago\n6. ¡Confirmas tu cupo al pagar!\n\nEl chat del partido se activa automáticamente para coordinar.',
    fu: ['matchmaking','matchmaking-chat','pago-dividido'],
  },
  {
    id: 'matchmaking-chat',
    cat: '⚽ Matchmaking',
    kw: ['chat partido','chat matchmaking','hablar jugadores','chat del partido','mensajes partido','comunicarme jugadores','coordinacion partido'],
    ans: 'Cada partido tiene un **chat grupal** integrado:\n\n1. Ve a **Matchmaking**\n2. Entra al partido\n3. Toca **"Chat del partido"** 💬\n4. ¡Coordina con todos los jugadores!\n\nIdeal para: hora de llegada, colores de camiseta, llevar balón, estacionamiento, etc.',
    fu: ['matchmaking','chat-reserva'],
  },
  {
    id: 'cancelar-partido',
    cat: '⚽ Matchmaking',
    kw: ['cancelar partido','cancelar matchmaking','salir partido','abandonar partido','quiero salir del partido','me arrepenti','cambié de opinión','cambié de opinion'],
    ans: 'Para **salir o cancelar un partido:**\n\n• Si eres **participante**: Ve al partido → "Cancelar participación"\n• Si eres **el organizador**: Ve al partido → "Cancelar partido" (se notifica a todos)\n\n⚠️ La política de reembolso aplica igual que en reservas normales.',
    fu: ['matchmaking','cancelar','reembolso'],
  },
  {
    id: 'matchmaking-nivel',
    cat: '⚽ Matchmaking',
    kw: ['nivel partido','nivel habilidad','amateur','profesional','principiante','avanzado','intermedio','nivel de juego'],
    ans: 'Al crear un partido en Matchmaking, el organizador puede indicar el **nivel de juego esperado**:\n\n🟢 Principiante\n🟡 Intermedio\n🔴 Avanzado\n🏆 Competitivo\n\nAsí todos los participantes saben qué esperar. ¡Para que el partido sea parejo y divertido!',
    fu: ['matchmaking','matchmaking-crear'],
  },

  // ── TORNEOS ────────────────────────────────────────────────────────────────
  {
    id: 'torneos',
    cat: '🏆 Torneos',
    kw: ['torneo','torneos','liga','ligas','competencia','competencias','campeonato','copa','torneo deportivo','quiero competir','participar en torneo'],
    ans: '**Torneos en PlayStop** 🏆\n\nCompetencias organizadas por complejos deportivos de Lima.\n\n• Deportes: Fútbol, Pádel, Básquet y más\n• Inscripción por equipo\n• Premios en efectivo y trofeos\n• Ver todos los torneos activos en **"/torneos"** desde el menú\n\n¿Quieres inscribirte o crear un torneo?',
    fu: ['torneos-inscripcion','torneos-crear','torneos-precio'],
  },
  {
    id: 'torneos-inscripcion',
    cat: '🏆 Torneos',
    kw: ['inscribir equipo','registrar equipo','como me inscribo','como inscribirse','unirme torneo','participar torneo','quiero participar en torneo','inscripcion torneo'],
    ans: '**Inscribir tu equipo en un torneo:**\n\n1. Ve al menú → **"Torneos"**\n2. Filtra por deporte y encuentra el que te gusta\n3. Toca **"Inscribir mi equipo"**\n4. Ingresa el nombre de tu equipo\n5. Confirma el pago de inscripción\n6. ¡Recibes confirmación por correo!\n\n📌 Asegúrate de inscribirte antes de que se complete el cupo.',
    fu: ['torneos','metodos-pago','torneos-precio'],
  },
  {
    id: 'torneos-precio',
    cat: '🏆 Torneos',
    kw: ['precio torneo','costo torneo','cuanto sale el torneo','inscripcion precio','cuanto cuesta torneo','cuanto es el torneo'],
    ans: 'El costo de inscripción **varía por torneo** y es establecido por el organizador.\n\n💰 Generalmente desde:\n• Fútbol 5: S/ 100–200 por equipo\n• Pádel (dobles): S/ 60–120 por equipo\n• Básquet: S/ 150–300 por equipo\n\nVe la información completa de cada torneo en la sección **"Torneos"** del menú.',
    fu: ['torneos','torneos-inscripcion','metodos-pago'],
  },
  {
    id: 'torneos-crear',
    cat: '🏆 Torneos',
    kw: ['crear torneo','organizar torneo','hacer torneo','publicar torneo','torneo propio','quiero hacer un torneo'],
    ans: '**Crear un torneo (solo propietarios):**\n\n1. Dashboard Propietario → **"Torneos"**\n2. Toca **"+ Nuevo Torneo"**\n3. Define: nombre, deporte, cancha, fechas, máx. equipos, precio de inscripción y premio\n4. Publica — aparece automáticamente en la página pública\n\n¡Los jugadores pueden inscribirse directamente desde la app!',
    fu: ['torneos','soy-propietario','planes'],
  },

  // ── GAMIFICACIÓN ──────────────────────────────────────────────────────────
  {
    id: 'gamificacion',
    cat: '🎮 Logros',
    kw: ['puntos','xp','experiencia','nivel','niveles','gamificacion','gamificación','rango','subo de nivel','puntuacion','cuantos puntos'],
    ans: '**Sistema de niveles en PlayStop** 🎮\n\n• Ganas **XP** al reservar y asistir a partidos\n• Niveles: **Rookie → Amateur → Pro → Elite → Leyenda**\n• Tu XP acumulado no desaparece — siempre subes\n\nVe tu nivel en la sección **"Logros"** de tu dashboard.',
    fu: ['logros','estadisticas','referidos'],
  },
  {
    id: 'logros',
    cat: '🎮 Logros',
    kw: ['logro','logros','insignia','insignias','medalla','medallas','badge','achievement','recompensa','desbloquear logro','tengo logros'],
    ans: '**Insignias y logros en PlayStop** 🏅\n\nDesbloquea insignias por:\n• 🥇 Primera reserva\n• 🔟 10 partidos jugados\n• 🔥 Racha de meses activos\n• ⭐ Dejar 5 reseñas\n• 👥 Invitar amigos\n• 🏆 Participar en torneos\n• y muchas más...\n\nVe todos tus logros en **Dashboard → "Logros"**',
    fu: ['gamificacion','estadisticas','amigos'],
  },
  {
    id: 'estadisticas',
    cat: '🎮 Logros',
    kw: ['estadisticas','estadísticas','historial partidos','mis partidos','partidos jugados','racha','cancha favorita','deporte favorito','asistencias','mis estadisticas','cuantos partidos'],
    ans: '**Tus estadísticas en PlayStop** 📊\n\nDashboard → **"Estadísticas"**:\n\n• 📊 Partidos por deporte (barras)\n• 🔥 Racha de meses activos\n• ⭐ Cancha y deporte favorito\n• 📅 Actividad últimos 6 meses\n• 🎯 Tasa de asistencia\n• 🏆 Posición en el ranking',
    fu: ['gamificacion','logros'],
  },

  // ── AMIGOS Y REFERIDOS ──────────────────────────────────────────────────────
  {
    id: 'amigos',
    cat: '👥 Social',
    kw: ['amigos','amigo','agregar amigo','añadir amigo','buscar amigo','invitar amigo','lista amigos','solicitud amistad','mis amigos','amigos playstop'],
    ans: '**Agregar amigos en PlayStop:**\n\n1. Dashboard → pestaña **"Amigos"**\n2. Toca **"Agregar amigo"**\n3. Busca por **correo electrónico**\n4. Envía solicitud\n5. Cuando acepten, pueden invitarse a partidos y torneos\n\n¡Crea tu círculo deportivo y organicen más partidos juntos!',
    fu: ['matchmaking','referidos'],
  },
  {
    id: 'referidos',
    cat: '👥 Social',
    kw: ['referido','referidos','codigo referido','invitar personas','codigo de referencia','referral','invita amigos','gana puntos invitando','codigo de invitación','codigo de invitacion','invita y gana'],
    ans: '**Programa de Referidos PlayStop** 🎁\n\n1. Ve a Dashboard → **"Referidos"**\n2. Copia tu **código único de referido**\n3. Compártelo con amigos por WhatsApp\n4. Cuando se registren y reserven, **ambos ganan puntos**\n5. Acumula puntos para canjear **descuentos en reservas**\n\n¡No hay límite de referidos!',
    fu: ['amigos','gamificacion','logros'],
  },
  {
    id: 'compartir',
    cat: '👥 Social',
    kw: ['compartir cancha','compartir partido','compartir por whatsapp','whatsapp','enviar a amigos','compartir link','invitar via','share'],
    ans: 'Puedes compartir canchas y partidos fácilmente:\n\n📱 **WhatsApp** — Botón directo de compartir\n🔗 **Copiar enlace** — Para enviar por cualquier medio\n📤 **Share nativo** — Usa las apps instaladas en tu celular\n\nLo encuentras en la página de cada cancha y en los partidos de Matchmaking.',
    fu: ['matchmaking','amigos'],
  },

  // ── NOTIFICACIONES ─────────────────────────────────────────────────────────
  {
    id: 'notificaciones',
    cat: '🔔 Notificaciones',
    kw: ['notificacion','notificaciones','notificación','recordatorio','recordatorios','alerta','alertas','aviso','avisos','push notification','me avisan','me notifican','aviso partido'],
    ans: '**Notificaciones en PlayStop** 🔔\n\nTipos de notificaciones que recibes:\n• ⏰ **Recordatorio** — 1 hora antes de tu partido\n• 💬 **Chat** — Nuevo mensaje del propietario o equipo\n• ✅ **Confirmación** — Reserva confirmada\n• ❌ **Cancelación** — Reserva o partido cancelado\n• 👥 **Matchmaking** — Alguien se unió a tu partido\n\nActiva las notificaciones al confirmar tu primera reserva.',
    fu: ['activar-notificaciones','como-reservar'],
  },
  {
    id: 'activar-notificaciones',
    cat: '🔔 Notificaciones',
    kw: ['activar notificaciones','como activo notificaciones','cómo activo notificaciones','permitir notificaciones','habilitar notificaciones','no me llegan notificaciones','no recibo notificaciones','notificaciones no llegan'],
    ans: '**Activar notificaciones push:**\n\n1. Al confirmar una reserva, toca **"Activar recordatorio"** 🔔\n2. El navegador te pedirá permiso — toca **"Permitir"**\n3. ¡Listo! Recibirás un aviso 1 hora antes\n\n**¿No te llegó la notificación?**\n• Verifica que las notificaciones estén permitidas en tu navegador\n• En Chrome: Configuración → Privacidad → Notificaciones → PlayStop\n• Asegúrate de que tu celular no esté en modo **No Molestar**',
    fu: ['notificaciones','soporte'],
  },

  // ── CHAT ──────────────────────────────────────────────────────────────────
  {
    id: 'chat-reserva',
    cat: '💬 Chat',
    kw: ['chat','chatear','hablar propietario','mensajes','mensaje','comunicarme','contactar propietario','chat reserva','enviar mensaje','escribir propietario'],
    ans: '**Chat con el propietario:**\n\nCada reserva tiene chat directo con el dueño de la cancha:\n\n1. Dashboard → **Mis Reservas**\n2. Encuentra tu reserva\n3. Toca **"Chat"** 💬\n4. Escribe tu mensaje\n\nIdeal para preguntar sobre: estacionamiento, duchas, implementos, colores de cancha, etc.',
    fu: ['reservas','moderacion-chat'],
  },
  {
    id: 'moderacion-chat',
    cat: '💬 Chat',
    kw: ['moderacion','moderación','palabras prohibidas','lenguaje inapropiado','insultos','chat moderado','censurado','mensaje bloqueado','ban chat','suspensión chat'],
    ans: '**Moderación del chat PlayStop:**\n\nEl chat filtra automáticamente el lenguaje inapropiado.\n\n**Escalada de sanciones:**\n⚠️ 1ª vez → Advertencia\n🚫 2ª vez → Suspensión 1 día\n🚫 3ª vez → Suspensión 5 días\n⛔ 4ª vez → Bloqueo permanente\n\nMantén un ambiente respetuoso para todos. Las sanciones son automáticas.',
    fu: ['cuenta-suspendida','soporte'],
  },

  // ── PROPIETARIOS ──────────────────────────────────────────────────────────
  {
    id: 'soy-propietario',
    cat: '🏟️ Propietarios',
    kw: ['club','complejo','propietario','registrar cancha','publicar cancha','tengo canchas','dueño','soy propietario','tengo un complejo','quiero publicar','gestionar cancha','soy dueño'],
    ans: '**¿Tienes un complejo deportivo?** 🏟️\n\nCon PlayStop en minutos puedes:\n✅ Publicar tus canchas con fotos\n✅ Gestionar reservas con calendario visual\n✅ Cobrar online automáticamente\n✅ Ver analíticas de ingresos en tiempo real\n✅ Organizar torneos para tu comunidad\n✅ Gestionar tu tienda de implementos\n✅ Verificar asistencia con QR Scanner\n\n📩 Regístrate como Propietario desde la web o escríbenos a **clubes@playstop.pe**',
    fu: ['planes','agregar-cancha','qr-scanner','analiticas'],
  },
  {
    id: 'agregar-cancha',
    cat: '🏟️ Propietarios',
    kw: ['agregar cancha','añadir cancha','nueva cancha','como publico','cómo publico','publicar mi cancha','como registro cancha','cómo registro cancha','registrar mi cancha'],
    ans: '**Publicar una cancha:**\n\n1. Dashboard Propietario → **"Mis Canchas"**\n2. Toca **"+ Nueva Cancha"**\n3. Completa: nombre, deporte, precio por hora, dirección, distrito\n4. Sube **fotos** (arrastra o selecciona)\n5. Define la **política de cancelación** (horas gratis + % reembolso)\n6. ¡Publica! Ya aparece para todos los jugadores\n\n💡 Canchas con fotos reciben hasta **3× más reservas**.',
    fu: ['soy-propietario','politica-cancelacion','analiticas'],
  },
  {
    id: 'politica-cancelacion',
    cat: '🏟️ Propietarios',
    kw: ['politica cancelacion','política cancelación','configurar cancelacion','horas cancelacion gratis','porcentaje reembolso','cancelacion gratuita','definir politica'],
    ans: '**Configurar la política de cancelación de tu cancha:**\n\nAl crear o editar una cancha defines:\n• **Horas de cancelación gratis** → Ej: 24h (el jugador cancela gratis si lo hace con 24h de antelación)\n• **% de reembolso después** → Ej: 50% (si cancela con menos tiempo)\n\nLos jugadores ven esta política antes de confirmar su reserva. ¡Reduce cancelaciones tardías!',
    fu: ['agregar-cancha','cancelar'],
  },
  {
    id: 'qr-scanner',
    cat: '🏟️ Propietarios',
    kw: ['escanear qr','scanner qr','verificar asistencia','confirmar asistencia','verificar jugador','lector qr','escaner','como verifico','cómo verifico'],
    ans: '**Verificar asistencia con QR Scanner:**\n\n1. Dashboard Propietario → **"Escanear QR"**\n2. Apunta la cámara al QR del jugador (o ingresa el código manual)\n3. Verificación instantánea ✅\n\n📱 Funciona desde el celular. Sin apps adicionales, solo el navegador.',
    fu: ['qr','soy-propietario'],
  },
  {
    id: 'analiticas',
    cat: '🏟️ Propietarios',
    kw: ['analitica','analítica','analiticas','analíticas','reportes','ingresos mes','graficos','gráficos','estadisticas propietario','exportar','exportar csv','descargar reporte','metricas'],
    ans: '**Panel Analíticas (Propietarios):**\n\nDashboard → **"Analíticas"**:\n\n📊 Ingresos totales y por cancha\n📅 Reservas por mes (últimos 6 meses)\n🏆 Deporte más rentable\n📉 Tasa de cancelación\n📤 **Exportar CSV** para llevar a Excel\n\nTodo en tiempo real con cada nueva reserva.',
    fu: ['ingresos-propietario','planes'],
  },
  {
    id: 'tienda',
    cat: '🏟️ Propietarios',
    kw: ['tienda','productos','vender productos','implementos','balones','pelotas','bebidas','articulos','artículos','store','gestion tienda','tienda del complejo'],
    ans: '**Tienda del Complejo (Propietarios):**\n\nDashboard → **"Tienda"**:\n\n🛒 Agrega productos en 2 categorías:\n• **Deportivos** — Balones, guantes, rodilleras, etc.\n• **Abarrotes** — Agua, bebidas, snacks\n\n📸 Puedes subir fotos de los productos\n📦 Define precio y stock disponible\n👀 Los jugadores ven tu tienda al visitar tu cancha',
    fu: ['soy-propietario','planes'],
  },
  {
    id: 'cancelar-como-propietario',
    cat: '🏟️ Propietarios',
    kw: ['cancelar reserva propietario','como cancelo como propietario','cancelar reserva de jugador','propietario cancela','el propietario cancela'],
    ans: 'Como propietario puedes cancelar una reserva desde:\n\nDashboard → **Últimas Reservas** → botón **"Cancelar"**\n\n⚠️ Al cancelar como propietario:\n• El jugador recibe **reembolso automático del 100%**\n• El jugador es notificado por correo y en la app\n• Aparece en tu historial como "Cancelada por propietario"\n\nÚsalo solo en casos justificados (mantenimiento, emergencia, etc.)',
    fu: ['cancelar','soporte'],
  },

  // ── SOPORTE TÉCNICO ───────────────────────────────────────────────────────
  {
    id: 'soporte',
    cat: '🆘 Soporte',
    kw: ['soporte','ayuda','contacto','contactar','atencion','atención','servicio al cliente','queja','reclamo','telefono','teléfono','correo soporte','whatsapp soporte','comunicarme con soporte'],
    ans: '**Contacta con nuestro equipo:**\n\n📧 **Email**: soporte@playstop.pe\n📱 **WhatsApp**: +51 900 000 000\n🕘 **Horario**: Lun–Vie 9am–6pm (Lima)\n🌐 **Formulario**: Sección "Contacto" de la web\n\nPara propietarios: **clubes@playstop.pe**\nPara facturación: incluye tu N° de reserva en el mensaje.',
    fu: ['error','soporte-tiempo-respuesta'],
  },
  {
    id: 'soporte-tiempo-respuesta',
    cat: '🆘 Soporte',
    kw: ['cuanto demoran','cuánto demoran','tiempo respuesta','cuando responden','cuándo responden','horas de atencion','horario soporte'],
    ans: '**Tiempos de respuesta:**\n\n📧 **Email** → 24–48 horas hábiles\n📱 **WhatsApp** → 2–4 horas en horario de atención\n🕘 **Horario**: Lun–Vie 9am–6pm (Lima)\n\nPara emergencias urgentes (reserva en las próximas horas), usa WhatsApp para respuesta más rápida.',
    fu: ['soporte'],
  },
  {
    id: 'error',
    cat: '🆘 Soporte',
    kw: ['error','falla','no funciona','problema','bug','no carga','pantalla blanca','se cayo','se cayó','caido','caído','no abre','no responde','lento'],
    ans: '**¿Encontraste un error?** Prueba esto:\n\n1. Recarga la página (Ctrl+R / Cmd+R)\n2. Limpia caché (Ctrl+Shift+Del)\n3. Prueba en modo incógnito\n4. Intenta en otro navegador\n\n¿Persiste? Escríbenos a **soporte@playstop.pe** con:\n• Captura de pantalla del error\n• Navegador y sistema operativo que usas\n• Pasos para reproducir el problema',
    fu: ['soporte'],
  },
  {
    id: 'app-movil',
    cat: '🆘 Soporte',
    kw: ['app movil','app móvil','aplicacion movil','aplicación móvil','descargar app','playstore','appstore','android','iphone','ios','tiene app','pwa','instalar app'],
    ans: '**PlayStop en tu celular 📱**\n\nPlayStop es una **PWA (Progressive Web App)** — funciona como app nativa sin necesidad de descargarla de la tienda.\n\n**Cómo instalarla:**\n1. Abre PlayStop en Chrome o Safari\n2. Toca el botón de menú del navegador\n3. Selecciona **"Agregar a pantalla de inicio"**\n4. ¡Aparece como icono en tu celular!\n\nFunciona en Android e iOS.',
    fu: ['soporte','activar-notificaciones'],
  },
  {
    id: 'privacidad',
    cat: '🆘 Soporte',
    kw: ['privacidad','datos personales','mis datos','proteccion datos','gdpr','politica privacidad','política privacidad','seguridad datos','quien ve mis datos','datos seguros'],
    ans: '**Privacidad en PlayStop** 🔐\n\n• Tus datos están cifrados y almacenados de forma segura\n• No vendemos ni compartimos datos con terceros\n• Solo los propietarios de la cancha que reservas ven tu nombre\n• Puedes solicitar la eliminación de tus datos escribiendo a **soporte@playstop.pe**\n\nLee nuestra Política de Privacidad en el pie de página de la web.',
    fu: ['eliminar-cuenta','soporte'],
  },
  {
    id: 'terminos',
    cat: '🆘 Soporte',
    kw: ['terminos','términos','condiciones','terminos de uso','términos de uso','terminos y condiciones','reglamento','reglas','normas'],
    ans: 'Puedes leer nuestros **Términos y Condiciones** en el pie de página de la web → sección **"Legal"**.\n\nResumen de puntos clave:\n• Uso responsable de la plataforma\n• Política de cancelación y reembolsos\n• Reglas de moderación del chat\n• Obligaciones del propietario y del jugador',
    fu: ['soporte','privacidad'],
  },

];

// ═══════════════════════════════════════════════════════════════════════════════
// NL SEARCH INTENT
// ═══════════════════════════════════════════════════════════════════════════════
const SEARCH_TRIGGERS = [
  'quiero jugar','busco cancha','busco una cancha','hay cancha','hay alguna cancha',
  'necesito cancha','necesito una cancha','encontrar cancha','dame cancha',
  'reservar para','quiero reservar','buscar cancha','recomiendame','recomendame',
  'donde jugar','dónde jugar','jugamos en','podemos jugar','donde puedo jugar','dónde puedo jugar',
];
const SPORT_MAP = {
  'futbol': 'Fútbol','fútbol': 'Fútbol','football': 'Fútbol','soccer': 'Fútbol',
  'futbol 5': 'Fútbol 5','fútbol 5': 'Fútbol 5','f5': 'Fútbol 5',
  'futbol 7': 'Fútbol 7','fútbol 7': 'Fútbol 7','f7': 'Fútbol 7',
  'padel': 'Pádel','pádel': 'Pádel','paddle': 'Pádel',
  'tenis': 'Tenis','tennis': 'Tenis',
  'voley': 'Vóley','vóley': 'Vóley','voleibol': 'Vóley','volleyball': 'Vóley',
  'basket': 'Básquet','básquet': 'Básquet','basquet': 'Básquet','basketball': 'Básquet',
};
const LIMA_DISTRICTS = [
  'miraflores','san isidro','surco','barranco','la molina','san borja','pueblo libre',
  'magdalena','jesus maria','jesús maría','lince','san miguel','chorrillos','ate','vitarte',
  'san juan de lurigancho','sjl','villa el salvador','ves','comas','independencia',
  'los olivos','san martin','san martín','bellavista','callao','la perla',
  'lima centro','cercado','rimac','rímac','breña','la victoria','el agustino','surquillo',
];

function parseSearchIntent(input) {
  const t = norm(input);
  if (!SEARCH_TRIGGERS.some(tr => t.includes(norm(tr)))) return null;
  let sport = '';
  for (const [k, v] of Object.entries(SPORT_MAP)) {
    if (t.includes(norm(k))) { sport = v; break; }
  }
  let district = '';
  for (const d of LIMA_DISTRICTS) {
    if (t.includes(norm(d))) {
      district = d.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }
  let maxPrice = '';
  const pm = t.match(/(?:menos de|hasta|maximo|max|por)\s*(?:s\/\s*)?(\d+)/);
  if (pm) maxPrice = pm[1];
  const params = new URLSearchParams();
  if (sport)    params.set('sport', sport);
  if (district) params.set('district', district);
  if (maxPrice) params.set('maxPrice', maxPrice);
  return { sport, district, maxPrice, url: `/mapa?${params.toString()}` };
}

function buildSearchAnswer({ sport, district, maxPrice }) {
  const parts = [];
  if (sport)    parts.push(`**${sport}**`);
  if (district) parts.push(`en **${district}**`);
  if (maxPrice) parts.push(`hasta **S/ ${maxPrice}/hora**`);
  const desc = parts.length > 0
    ? `Encontré canchas de ${parts.join(' ')}.`
    : 'Busqué canchas disponibles para ti.';
  return `${desc}\n\nHaz clic abajo para ver todas las opciones en el mapa interactivo. 🗺️`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE MATCHING POR PUNTUACIÓN
// ═══════════════════════════════════════════════════════════════════════════════
const DEFAULT_ANS = {
  text: '¿No encontré bien lo que buscas. Intenta ser más específico, o elige un tema:\n\n📅 **Reservas** — cómo reservar, cancelar, QR, reembolso\n💰 **Precios** — costos, planes, métodos de pago\n🏟️ **Canchas** — buscar, mapa, favoritas, reseñas\n⚽ **Matchmaking** — armar partidos, unirse\n🏆 **Torneos** — inscribirte, crear torneos\n👤 **Cuenta** — login, contraseña, perfil\n🎮 **Logros** — XP, insignias, estadísticas\n🆘 **Soporte** — contacto, errores, privacidad',
  fu: ['como-reservar','matchmaking','torneos','mi-cuenta','soporte'],
};

function getResponse(input) {
  const t = norm(input);
  let bestScore = 0;
  let best = null;
  for (const e of KB) {
    let score = 0;
    for (const kw of e.kw) {
      if (t.includes(norm(kw))) score += kw.split(' ').length * 2;
    }
    if (score > bestScore) { bestScore = score; best = e; }
  }
  if (best && bestScore > 0) return { text: best.ans, fu: best.fu || [] };
  return DEFAULT_ANS;
}

// ── Follow-up labels ──────────────────────────────────────────────────────────
const FU = {
  'como-reservar':          { icon:'bi-calendar-check', label:'¿Cómo reservo?' },
  'reservas':               { icon:'bi-calendar3',       label:'Mis reservas' },
  'cancelar':               { icon:'bi-x-circle',        label:'Cancelar reserva' },
  'qr':                     { icon:'bi-qr-code-scan',    label:'Código QR' },
  'reembolso':              { icon:'bi-cash-coin',        label:'Reembolso' },
  'reprogramar':            { icon:'bi-arrow-repeat',    label:'Cambiar fecha' },
  'confirmacion':           { icon:'bi-check-circle',    label:'Confirmación' },
  'precios-canchas':        { icon:'bi-tag',             label:'Precios canchas' },
  'metodos-pago':           { icon:'bi-credit-card',     label:'Métodos de pago' },
  'pago-dividido':          { icon:'bi-people',          label:'Pago dividido' },
  'seguridad-pago':         { icon:'bi-shield-check',    label:'Seguridad de pago' },
  'pago-fallido':           { icon:'bi-exclamation-triangle','label':'Pago fallido' },
  'planes':                 { icon:'bi-star',            label:'Planes PRO' },
  'ingresos-propietario':   { icon:'bi-cash-stack',      label:'Cobros propietario' },
  'canchas':                { icon:'bi-geo-alt',         label:'Buscar canchas' },
  'mapa':                   { icon:'bi-map',             label:'Mapa interactivo' },
  'favoritas':              { icon:'bi-heart',           label:'Canchas favoritas' },
  'filtros':                { icon:'bi-funnel',          label:'Filtros de búsqueda' },
  'deportes':               { icon:'bi-dribbble',        label:'Deportes disponibles' },
  'reseñas':                { icon:'bi-star-half',       label:'Reseñas' },
  'implementos':            { icon:'bi-bag',             label:'Implementos' },
  'horarios':               { icon:'bi-clock',           label:'Horarios' },
  'matchmaking':            { icon:'bi-person-plus',     label:'Matchmaking' },
  'matchmaking-crear':      { icon:'bi-plus-circle',     label:'Crear partido' },
  'matchmaking-unirse':     { icon:'bi-door-open',       label:'Unirme a partido' },
  'matchmaking-chat':       { icon:'bi-chat-dots',       label:'Chat del partido' },
  'cancelar-partido':       { icon:'bi-x-circle',        label:'Cancelar partido' },
  'torneos':                { icon:'bi-trophy',          label:'Torneos' },
  'torneos-inscripcion':    { icon:'bi-trophy-fill',     label:'Inscribir equipo' },
  'torneos-precio':         { icon:'bi-tag',             label:'Precio torneos' },
  'torneos-crear':          { icon:'bi-plus-circle',     label:'Crear torneo' },
  'gamificacion':           { icon:'bi-lightning',       label:'Puntos y niveles' },
  'logros':                 { icon:'bi-award',           label:'Logros e insignias' },
  'estadisticas':           { icon:'bi-bar-chart',       label:'Estadísticas' },
  'amigos':                 { icon:'bi-people',          label:'Amigos' },
  'referidos':              { icon:'bi-gift',            label:'Referidos' },
  'notificaciones':         { icon:'bi-bell',            label:'Notificaciones' },
  'activar-notificaciones': { icon:'bi-bell-fill',       label:'Activar alertas' },
  'chat-reserva':           { icon:'bi-chat',            label:'Chat con propietario' },
  'moderacion-chat':        { icon:'bi-shield',          label:'Moderación chat' },
  'mi-cuenta':              { icon:'bi-person-circle',   label:'Mi cuenta' },
  'registro':               { icon:'bi-person-plus',     label:'Crear cuenta' },
  'login':                  { icon:'bi-box-arrow-in-right','label':'Iniciar sesión' },
  'google-login':           { icon:'bi-google',          label:'Entrar con Google' },
  'cambiar-contrasena':     { icon:'bi-lock',            label:'Contraseña' },
  'cambiar-foto':           { icon:'bi-camera',          label:'Foto de perfil' },
  'eliminar-cuenta':        { icon:'bi-trash',           label:'Eliminar cuenta' },
  'soy-propietario':        { icon:'bi-building',        label:'Para propietarios' },
  'agregar-cancha':         { icon:'bi-plus-square',     label:'Agregar cancha' },
  'qr-scanner':             { icon:'bi-qr-code-scan',   label:'Escáner QR' },
  'analiticas':             { icon:'bi-bar-chart-fill',  label:'Analíticas' },
  'tienda':                 { icon:'bi-shop',            label:'Tienda complejo' },
  'politica-cancelacion':   { icon:'bi-shield-check',   label:'Política cancelación' },
  'soporte':                { icon:'bi-headset',         label:'Soporte' },
  'error':                  { icon:'bi-bug',             label:'Reportar error' },
  'app-movil':              { icon:'bi-phone',           label:'App móvil' },
  'privacidad':             { icon:'bi-shield-lock',     label:'Privacidad' },
};

const QUICK_OPTIONS = [
  { icon:'bi-search',        label:'Buscar cancha',     text:'Quiero jugar fútbol en Miraflores hasta S/60' },
  { icon:'bi-calendar-check',label:'¿Cómo reservo?',   text:'¿Cómo reservar una cancha?' },
  { icon:'bi-trophy',        label:'Torneos',           text:'¿Cómo me inscribo en un torneo?' },
  { icon:'bi-person-plus',   label:'Matchmaking',       text:'¿Cómo funciona el matchmaking?' },
];

// ── Render markdown simple ────────────────────────────────────────────────────
function renderText(text) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function ChatBot({ darkMode = false }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from:'bot', text:'¡Hola! Soy el asistente de **PlayStop** 🏆\n\nPuedo ayudarte con reservas, canchas, torneos, matchmaking y más. ¿Sobre qué tema quieres saber?', fu:['como-reservar','torneos','matchmaking','mi-cuenta'], ts:Date.now() },
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing, open]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from:'user', text:msg, ts:Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const si = parseSearchIntent(msg);
      let bot;
      if (si) {
        bot = { from:'bot', text:buildSearchAnswer(si), searchResult:si, fu:['canchas','torneos'], ts:Date.now() };
      } else {
        const { text:reply, fu } = getResponse(msg);
        bot = { from:'bot', text:reply, fu:fu||[], ts:Date.now() };
      }
      setMessages(prev => [...prev, bot]);
      if (!open) setUnread(n => n+1);
    }, 480 + Math.random() * 360);
  };

  const dk = darkMode;
  const bg       = dk ? '#0f172a' : '#ffffff';
  const surface  = dk ? '#1e293b' : '#f8fafc';
  const border   = dk ? '#334155' : '#e2e8f0';
  const txtMain  = dk ? '#f8fafc' : '#0f172a';

  const lastBot = [...messages].reverse().find(m => m.from === 'bot');
  const fuChips = !typing && lastBot?.fu?.length > 0
    ? lastBot.fu.slice(0, 3).filter(id => FU[id])
    : [];
  const showInitial = messages.length <= 2 && !typing;

  return (
    <>
      <style>{`
        .cw{position:fixed;bottom:24px;right:24px;z-index:9000;font-family:inherit}
        .cfab{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#00b872);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 8px 25px rgba(37, 99, 235, .4);transition:transform .2s,box-shadow .2s;position:relative}
        .cfab:hover{transform:scale(1.08);box-shadow:0 12px 30px rgba(37, 99, 235, .5)}
        .cpanel{position:absolute;bottom:70px;right:0;width:375px;max-height:570px;border-radius:20px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:csu .3s cubic-bezier(.16,1,.3,1)}
        @keyframes csu{from{opacity:0;transform:translateY(18px) scale(.95)}to{opacity:1;transform:none}}
        .cmsgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px}
        .cmsgs::-webkit-scrollbar{width:4px}
        .cmsgs::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
        .cbbl{max-width:87%;padding:10px 13px;border-radius:16px;font-size:.86rem;line-height:1.56;word-break:break-word}
        .cbbl.bot{align-self:flex-start;border-bottom-left-radius:4px}
        .cbbl.user{align-self:flex-end;border-bottom-right-radius:4px;background:linear-gradient(135deg,#2563eb,#00b872);color:#fff}
        .tdot{width:7px;height:7px;border-radius:50%;background:#64748b;animation:tb 1.2s infinite}
        .tdot:nth-child(2){animation-delay:.2s}
        .tdot:nth-child(3){animation-delay:.4s}
        @keyframes tb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        .chip{padding:5px 11px;border-radius:99px;font-size:.74rem;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap;border:1.5px solid #2563eb;background:transparent;color:#2563eb;display:flex;align-items:center;gap:4px}
        .chip:hover{background:#2563eb;color:#0f172a}
        .cinput{flex:1;padding:10px 13px;border-radius:11px;font-size:.88rem;outline:none;font-family:inherit;transition:border-color .2s}
        .cinput:focus{border-color:#2563eb !important}
        .csend{width:40px;height:40px;border-radius:11px;border:none;background:linear-gradient(135deg,#2563eb,#00b872);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}
        .csend:disabled{opacity:.38;cursor:default}
        @media(max-width:420px){.cpanel{width:calc(100vw - 28px);right:-6px;max-height:490px}}
      `}</style>

      <div className="cw">
        {open && (
          <div className="cpanel" style={{ background:bg, border:`1px solid ${border}` }}>
            {/* Header */}
            <div style={{ padding:'13px 17px', background:'linear-gradient(135deg,#0f172a,#1e3a5f)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(37, 99, 235, .2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.15rem', color:'#2563eb' }}>
                  <i className="bi bi-robot" />
                </div>
                <div>
                  <div style={{ color:'#fff', fontWeight:800, fontSize:'.93rem', lineHeight:1 }}>Asistente PlayStop</div>
                  <div style={{ color:'#2563eb', fontSize:'.69rem', fontWeight:700, marginTop:3, display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:'#2563eb', display:'inline-block', animation:'pulse 2s infinite' }} />
                    En línea · Respuesta inmediata
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.55)', fontSize:'1.35rem', cursor:'pointer', lineHeight:1, padding:4 }}>×</button>
            </div>

            {/* Messages */}
            <div className="cmsgs" style={{ background:surface }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:m.from==='user'?'flex-end':'flex-start' }}>
                  <div className={`cbbl ${m.from}`} style={m.from==='bot'?{ background:bg, border:`1px solid ${border}`, color:txtMain }:{}}>
                    {renderText(m.text)}
                    {m.searchResult && (
                      <a href={m.searchResult.url} style={{ display:'flex', alignItems:'center', gap:7, marginTop:9, padding:'8px 12px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius:9, textDecoration:'none', fontWeight:800, fontSize:'.81rem', color: '#ffffff', boxShadow:'0 4px 12px rgba(37, 99, 235, .3)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Ver canchas en el mapa →
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="cbbl bot" style={{ background:bg, border:`1px solid ${border}` }}>
                  <div style={{ display:'flex', gap:5, alignItems:'center', padding:'2px 0' }}>
                    <div className="tdot"/><div className="tdot"/><div className="tdot"/>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Chips */}
            {(showInitial || fuChips.length > 0) && (
              <div style={{ padding:'7px 13px 5px', background:surface, display:'flex', gap:5, flexWrap:'wrap', borderTop:`1px solid ${border}` }}>
                {showInitial
                  ? QUICK_OPTIONS.map(o => (
                    <button key={o.label} className="chip" onClick={() => sendMessage(o.text)}>
                      <i className={`bi ${o.icon}`}/>{o.label}
                    </button>
                  ))
                  : fuChips.map(id => (
                    <button key={id} className="chip" onClick={() => sendMessage(FU[id].label)}>
                      <i className={`bi ${FU[id].icon}`}/>{FU[id].label}
                    </button>
                  ))
                }
              </div>
            )}

            {/* Input */}
            <div style={{ display:'flex', gap:8, padding:'11px 13px', background:bg, borderTop:`1px solid ${border}` }}>
              <input
                ref={inputRef} className="cinput" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe tu pregunta..."
                style={{ background:surface, border:`1.5px solid ${border}`, color:txtMain }}
              />
              <button className="csend" onClick={() => sendMessage()} disabled={!input.trim()||typing}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* FAB */}
        <button className="cfab" onClick={() => setOpen(o=>!o)} title="Abrir asistente PlayStop">
          {open
            ? <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          }
          {!open && unread > 0 && (
            <span style={{ position:'absolute', top:-4, right:-4, width:19, height:19, borderRadius:'50%', background:'#ef4444', color:'#fff', fontSize:'.68rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {unread}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
