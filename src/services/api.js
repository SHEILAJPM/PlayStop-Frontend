const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

const authHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

let sessionExpired = false;

export const resetSessionExpired = () => { sessionExpired = false; };

async function handleResponse(res) {
  if (res.status === 204) return null;
  if ((res.status === 401 || res.status === 403) && !sessionExpired) {
    sessionExpired = true;
    localStorage.removeItem('token');
    localStorage.removeItem('playspot-user');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const api = {

  // ── Canchas ──────────────────────────────────────────────────────────────

  async getAllCourts() {
    return handleResponse(await fetch(`${BASE_URL}/api/courts`));
  },

  async getMyCourts() {
    return handleResponse(await fetch(`${BASE_URL}/api/courts/my`, { headers: jsonHeaders() }));
  },

  async getCourtSlots(courtId, date) {
    const params = new URLSearchParams({ date });
    return handleResponse(await fetch(`${BASE_URL}/api/courts/${courtId}/slots?${params}`));
  },

  async createCourt(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/courts`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async updateCourt(id, data) {
    return handleResponse(await fetch(`${BASE_URL}/api/courts/${id}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async deleteCourt(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/courts/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    }));
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return handleResponse(await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: authHeader(),
      body: formData,
    }));
  },

  // ── Reservas ─────────────────────────────────────────────────────────────

  async getMyReservations() {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/my`, { headers: jsonHeaders() }));
  },

  async getCourtReservations(courtId) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/court/${courtId}`, { headers: jsonHeaders() }));
  },

  async createReservation(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async cancelReservation(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/${id}/cancel`, {
      method: 'PATCH',
      headers: jsonHeaders(),
    }));
  },

  async cancelReservationByOwner(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/${id}/cancel-by-owner`, {
      method: 'PATCH',
      headers: jsonHeaders(),
    }));
  },

  getReservationQrUrl(id) {
    return `${BASE_URL}/api/reservations/${id}/qr`;
  },

  async verifyReservation(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/verify/${id}`, { headers: jsonHeaders() }));
  },

  async confirmAttendance(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/reservations/${id}/confirm-attendance`, {
      method: 'PATCH',
      headers: jsonHeaders(),
    }));
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  async getAdminStats() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/stats`, { headers: jsonHeaders() }));
  },

  async getAdminAnalytics() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/analytics`, { headers: jsonHeaders() }));
  },

  async getAdminUsers() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/users`, { headers: jsonHeaders() }));
  },

  async getAdminOwners() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/owners`, { headers: jsonHeaders() }));
  },

  async getOwnerCourts(ownerId) {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/owners/${ownerId}/courts`, { headers: jsonHeaders() }));
  },

  async getAdminAllReservations() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/all-reservations`, { headers: jsonHeaders() }));
  },

  async getAdminCourts() {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/courts`, { headers: jsonHeaders() }));
  },

  async toggleUserStatus(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: jsonHeaders(),
    }));
  },

  async deleteAdminUser(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    }));
  },

  async toggleCourtStatus(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/admin/courts/${id}/toggle-status`, {
      method: 'PATCH',
      headers: jsonHeaders(),
    }));
  },

  // ── Reseñas ───────────────────────────────────────────────────────────────

  async getCourtReviews(courtId) {
    return handleResponse(await fetch(`${BASE_URL}/api/reviews/court/${courtId}`));
  },

  async getMyReviews() {
    return handleResponse(await fetch(`${BASE_URL}/api/reviews/my`, { headers: jsonHeaders() }));
  },

  async createReview(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async deleteReview(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    }));
  },

  // ── Perfil de usuario ─────────────────────────────────────────────────────

  async getMe() {
    return handleResponse(await fetch(`${BASE_URL}/api/users/me`, { headers: jsonHeaders() }));
  },

  async updateMe(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/users/me`, {
      method: 'PATCH',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async updateAvatar(profileImageUrl) {
    return handleResponse(await fetch(`${BASE_URL}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: jsonHeaders(),
      body: JSON.stringify({ profileImageUrl }),
    }));
  },

  async changePassword(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/users/me/password`, {
      method: 'PATCH',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  // ── Gamificación ──────────────────────────────────────────────────────────

  async getGamificationProfile() {
    return handleResponse(await fetch(`${BASE_URL}/api/gamification/me`, { headers: jsonHeaders() }));
  },

  // ── Cancha por slug (página pública) ──────────────────────────────────────

  async getCourtBySlug(slug) {
    return handleResponse(await fetch(`${BASE_URL}/api/courts/slug/${encodeURIComponent(slug)}`));
  },

  // ── Matchmaking ───────────────────────────────────────────────────────────

  async getOpenMatches() {
    return handleResponse(await fetch(`${BASE_URL}/api/match`));
  },

  async createMatch(data) {
    return handleResponse(await fetch(`${BASE_URL}/api/match`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }));
  },

  async joinMatch(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/match/${id}/join`, {
      method: 'POST',
      headers: jsonHeaders(),
    }));
  },

  async cancelMatch(id) {
    return handleResponse(await fetch(`${BASE_URL}/api/match/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    }));
  },

  // ── Referidos ─────────────────────────────────────────────────────────────

  async getReferralInfo() {
    return handleResponse(await fetch(`${BASE_URL}/api/referrals/me`, { headers: jsonHeaders() }));
  },

  async applyReferralCode(code) {
    return handleResponse(await fetch(`${BASE_URL}/api/referrals/apply`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ code }),
    }));
  },
};
