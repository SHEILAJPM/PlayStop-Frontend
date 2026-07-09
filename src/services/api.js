const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// La sesión viaja como cookie httpOnly (ver JwtCookieService en el backend),
// nunca en JS: así un XSS en el frontend no puede robar el token leyéndolo de
// localStorage. `credentials: 'include'` es lo que hace que el navegador
// adjunte esa cookie en cada petición, incluso siendo backend/frontend
// orígenes distintos (onrender.com en subdominios separados).

// Token de doble envío para CSRF: el backend fija la cookie XSRF-TOKEN en
// cada request (ver CsrfCookieFilter), pero frontend y backend viven en
// dominios distintos (onrender.com en subdominios separados), así que el JS
// de aquí NUNCA puede leer esa cookie con document.cookie (pertenece al
// dominio del backend). Por eso el backend también expone el mismo valor en
// el cuerpo JSON de GET /api/auth/csrf; lo cacheamos en memoria la primera
// vez que hace falta y lo reenviamos como header en cada petición que
// cambia estado.
let csrfTokenPromise = null;

async function fetchCsrfToken() {
  const res = await fetch(`${BASE_URL}/api/auth/csrf`, { credentials: 'include' });
  const data = await res.json();
  return data.token;
}

function getCsrfToken() {
  if (!csrfTokenPromise) csrfTokenPromise = fetchCsrfToken().catch(err => { csrfTokenPromise = null; throw err; });
  return csrfTokenPromise;
}

async function csrfHeader() {
  try {
    const token = await getCsrfToken();
    return token ? { 'X-XSRF-TOKEN': token } : {};
  } catch {
    return {};
  }
}

// Exportado para los pocos lugares (AuthContext, páginas de login/registro)
// que llaman a fetch() directamente en vez de pasar por este módulo.
export const getCsrfHeader = csrfHeader;

async function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(await csrfHeader()),
  };
}

let sessionExpired = false;

export const resetSessionExpired = () => { sessionExpired = false; };

// ── Offline cache helpers ─────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function cacheSet(key, data) {
  try {
    localStorage.setItem(`_cache_${key}`, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* storage lleno */ }
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(`_cache_${key}`);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

// Fetch con timeout (evita colgar en Render cold-start) y credenciales
// (cookie de sesión) incluidas siempre.
async function fetchWithTimeout(url, options = {}, ms = 60000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, credentials: 'include', signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// Wrapper de fetch() plano que asegura que la cookie de sesión viaje siempre,
// para no tener que repetir `credentials: 'include'` en cada llamada.
async function apiFetch(url, options = {}) {
  return fetch(url, { ...options, credentials: 'include' });
}

// ─────────────────────────────────────────────────────────────────────────────

// Reintenta una vez con un token CSRF recién pedido si la primera respuesta
// fue 403: el token cacheado por getCsrfToken() puede desincronizarse de la
// cookie XSRF-TOKEN actual (p.ej. tras un login o una recarga), y ese 403 no
// significa que la sesión haya expirado, solo que ese envío puntual llevaba
// un token viejo. `doFetch` debe recalcular los headers en cada llamada para
// que el reintento use el token nuevo.
async function withCsrfRetry(doFetch) {
  let res = await doFetch();
  if (res.status === 403) {
    csrfTokenPromise = null;
    res = await doFetch();
  }
  return res;
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  // Solo un 401 significa "no autenticado": ahí sí forzamos logout. Un 403
  // puede ser un rol insuficiente o un token CSRF inválido/desincronizado, y
  // en ninguno de los dos casos la sesión realmente expiró, así que no tiene
  // sentido tirar al usuario al login.
  if (res.status === 401 && !sessionExpired) {
    sessionExpired = true;
    localStorage.removeItem('playspot-user');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }
  if (res.status === 403) csrfTokenPromise = null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

// GET con fallback a cache cuando está offline
async function cachedGet(url, cacheKey, headers = {}) {
  if (isOffline()) {
    const cached = cacheGet(cacheKey);
    if (cached) return cached;
    throw new Error('Sin conexión. Datos no disponibles offline.');
  }
  const res = await fetchWithTimeout(url, { headers });
  const data = await handleResponse(res);
  cacheSet(cacheKey, data);
  return data;
}

export const api = {

  // ── Canchas ──────────────────────────────────────────────────────────────

  async getAllCourts() {
    return cachedGet(`${BASE_URL}/api/courts`, 'all_courts');
  },

  async getMyCourts() {
    return handleResponse(await fetchWithTimeout(`${BASE_URL}/api/courts/my`, { headers: await jsonHeaders() }));
  },

  async getCourtSlots(courtId, date) {
    const params = new URLSearchParams({ date });
    return handleResponse(await fetchWithTimeout(`${BASE_URL}/api/courts/${courtId}/slots?${params}`));
  },

  async createCourt(data) {
    return handleResponse(await withCsrfRetry(async () => fetchWithTimeout(`${BASE_URL}/api/courts`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async updateCourt(id, data) {
    return handleResponse(await withCsrfRetry(async () => fetchWithTimeout(`${BASE_URL}/api/courts/${id}`, {
      method: 'PUT',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async deleteCourt(id) {
    return handleResponse(await withCsrfRetry(async () => fetchWithTimeout(`${BASE_URL}/api/courts/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return handleResponse(await withCsrfRetry(async () => fetchWithTimeout(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: await csrfHeader(),
      body: formData,
    })));
  },

  // ── Reservas ─────────────────────────────────────────────────────────────

  async getMyReservations() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/reservations/my`, { headers: await jsonHeaders() }));
  },

  async getCourtReservations(courtId) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/reservations/court/${courtId}`, { headers: await jsonHeaders() }));
  },

  async createReservation(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async getReservationById(id) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/reservations/${id}`, { headers: await jsonHeaders() }));
  },

  async createCheckoutSession(reservationId) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/payments/checkout/${reservationId}`, {
      method: 'POST',
      headers: await jsonHeaders(),
    })));
  },

  // ── Retiros (propietario) ───────────────────────────────────────────────

  async getPayoutBalance() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/payouts/balance`, { headers: await jsonHeaders() }));
  },

  async getMyPayoutRequests() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/payouts/my`, { headers: await jsonHeaders() }));
  },

  async createPayoutRequest(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/payouts`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  // ── Retiros (admin) ──────────────────────────────────────────────────────

  async getAllPayoutRequests(status) {
    const qs = status ? `?status=${status}` : '';
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/payouts${qs}`, { headers: await jsonHeaders() }));
  },

  async markPayoutAsPaid(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/payouts/${id}/pay`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  async rejectPayout(id, reason) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/payouts/${id}/reject`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
      body: JSON.stringify({ reason }),
    })));
  },

  // ── Suscripción (propietario) ────────────────────────────────────────────

  async getMySubscription() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/subscriptions/me`, { headers: await jsonHeaders() }));
  },

  async createSubscriptionCheckout(plan) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/subscriptions/checkout`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ plan }),
    })));
  },

  async cancelReservation(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reservations/${id}/cancel`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  async cancelReservationByOwner(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reservations/${id}/cancel-by-owner`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  getReservationQrUrl(id) {
    return `${BASE_URL}/api/reservations/${id}/qr`;
  },

  async verifyReservation(id) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/reservations/verify/${id}`, { headers: await jsonHeaders() }));
  },

  async confirmAttendance(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reservations/${id}/confirm-attendance`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  async getAdminStats() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/stats`, { headers: await jsonHeaders() }));
  },

  async getAdminAnalytics() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/analytics`, { headers: await jsonHeaders() }));
  },

  async getAdminUsers() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/users`, { headers: await jsonHeaders() }));
  },

  async getAdminOwners() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/owners`, { headers: await jsonHeaders() }));
  },

  async getOwnerCourts(ownerId) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/owners/${ownerId}/courts`, { headers: await jsonHeaders() }));
  },

  async getAdminAllReservations() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/all-reservations`, { headers: await jsonHeaders() }));
  },

  async getAdminCourts() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/courts`, { headers: await jsonHeaders() }));
  },

  async toggleUserStatus(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  async deleteAdminUser(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  async toggleCourtStatus(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/courts/${id}/toggle-status`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  async getAdminChatModeration() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/admin/chat-moderation`, { headers: await jsonHeaders() }));
  },

  async liftChatBan(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/admin/users/${id}/lift-chat-ban`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
    })));
  },

  // ── Reseñas ───────────────────────────────────────────────────────────────

  async getCourtReviews(courtId) {
    return cachedGet(`${BASE_URL}/api/reviews/court/${courtId}`, `reviews_${courtId}`);
  },

  async getMyReviews() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/reviews/my`, { headers: await jsonHeaders() }));
  },

  async createReview(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async deleteReview(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  // ── Perfil de usuario ─────────────────────────────────────────────────────

  async getMe() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/users/me`, { headers: await jsonHeaders() }));
  },

  async updateMe(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/users/me`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async updateAvatar(profileImageUrl) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
      body: JSON.stringify({ profileImageUrl }),
    })));
  },

  async changePassword(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/users/me/password`, {
      method: 'PATCH',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  // ── Gamificación ──────────────────────────────────────────────────────────

  async getGamificationProfile() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/gamification/me`, { headers: await jsonHeaders() }));
  },

  // ── Cancha por slug (página pública) ──────────────────────────────────────

  async getCourtBySlug(slug) {
    return cachedGet(`${BASE_URL}/api/courts/slug/${encodeURIComponent(slug)}`, `court_slug_${slug}`);
  },

  // ── Matchmaking ───────────────────────────────────────────────────────────

  async getOpenMatches() {
    return cachedGet(`${BASE_URL}/api/match`, 'open_matches');
  },

  async createMatch(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/match`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async joinMatch(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/match/${id}/join`, {
      method: 'POST',
      headers: await jsonHeaders(),
    })));
  },

  async cancelMatch(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/match/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  // ── Amigos / búsqueda de usuarios ────────────────────────────────────────

  async searchUserByEmail(email) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/users/search?email=${encodeURIComponent(email)}`, { headers: await jsonHeaders() }));
  },

  async sendFriendRequest(targetUserId) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ targetUserId }),
    })));
  },

  async getFriends() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/friends`, { headers: await jsonHeaders() }));
  },

  async removeFriend(friendId) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/friends/${friendId}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  // ── Chat por reserva ──────────────────────────────────────────────────────

  async getChatMessages(reservationId) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/chat/${reservationId}/messages`, { headers: await jsonHeaders() }));
  },

  // ── Chat por partido (matchmaking) ────────────────────────────────────────

  async getMatchChatMessages(matchId) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/match/${matchId}/messages`, { headers: await jsonHeaders() }));
  },

  async sendMatchChatMessage(matchId, content) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/match/${matchId}/messages`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ content }),
    })));
  },

  // ── Auth social ──────────────────────────────────────────────────────────

  async loginWithGoogle(idToken) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await csrfHeader()) },
      body: JSON.stringify({ idToken }),
    }));
  },

  // ── Recomendaciones IA ───────────────────────────────────────────────────

  async getRecommendations() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/recommendations`, { headers: await jsonHeaders() }));
  },

  // ── Torneos ───────────────────────────────────────────────────────────────

  async getTournaments() {
    return cachedGet(`${BASE_URL}/api/tournaments`, 'tournaments');
  },

  async createTournament(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/tournaments`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async joinTournament(id, teamName) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/tournaments/${id}/join`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ teamName }),
    })));
  },

  async cancelTournament(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/tournaments/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  // ── Analytics propietario ─────────────────────────────────────────────────

  async getOwnerAnalytics() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/analytics/owner`, { headers: await jsonHeaders() }));
  },

  // ── Referidos ─────────────────────────────────────────────────────────────

  async getReferralInfo() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/referrals/me`, { headers: await jsonHeaders() }));
  },

  async applyReferralCode(code) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/referrals/apply`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ code }),
    })));
  },

  // ── Sucursales y empleados (Plan Enterprise) ──────────────────────────────

  async getMyBranches() {
    return handleResponse(await apiFetch(`${BASE_URL}/api/branches/my`, { headers: await jsonHeaders() }));
  },

  async createBranch(data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/branches`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async updateBranch(id, data) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/branches/${id}`, {
      method: 'PUT',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    })));
  },

  async deleteBranch(id) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/branches/${id}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  async getBranchEmployees(branchId) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/branches/${branchId}/employees`, { headers: await jsonHeaders() }));
  },

  async inviteEmployee(branchId, email) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/branches/${branchId}/employees`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ email }),
    })));
  },

  async removeEmployee(branchId, employeeId) {
    return handleResponse(await withCsrfRetry(async () => apiFetch(`${BASE_URL}/api/branches/${branchId}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    })));
  },

  async getInvitationInfo(token) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/auth/invitations/${token}`));
  },

  async registerEmployee(data) {
    return handleResponse(await apiFetch(`${BASE_URL}/api/auth/register/employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await csrfHeader()) },
      body: JSON.stringify(data),
    }));
  },
};
