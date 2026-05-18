const BASE_URL = 'http://localhost:8080';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

const handleResponse = async (res) => {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
};

export const api = {
  // --- Canchas (Courts) ---
  getAllCourts: () =>
    fetch(`${BASE_URL}/api/courts`).then(handleResponse),

  getMyCourts: () =>
    fetch(`${BASE_URL}/api/courts/my`, { headers: authHeaders() }).then(handleResponse),

  getCourtSlots: (courtId, date) =>
    fetch(`${BASE_URL}/api/courts/${courtId}/slots?date=${date}`).then(handleResponse),

  createCourt: (data) =>
    fetch(`${BASE_URL}/api/courts`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateCourt: (id, data) =>
    fetch(`${BASE_URL}/api/courts/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteCourt: (id) =>
    fetch(`${BASE_URL}/api/courts/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
      body: formData,
    }).then(handleResponse);
  },

  // --- Reservas (Reservations) ---
  getMyReservations: () =>
    fetch(`${BASE_URL}/api/reservations/my`, { headers: authHeaders() }).then(handleResponse),

  getCourtReservations: (courtId) =>
    fetch(`${BASE_URL}/api/reservations/court/${courtId}`, { headers: authHeaders() }).then(handleResponse),

  createReservation: (data) =>
    fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  cancelReservation: (id) =>
    fetch(`${BASE_URL}/api/reservations/${id}/cancel`, {
      method: 'PATCH',
      headers: authHeaders(),
    }).then(handleResponse),

  cancelReservationByOwner: (id) =>
    fetch(`${BASE_URL}/api/reservations/${id}/cancel-by-owner`, {
      method: 'PATCH',
      headers: authHeaders(),
    }).then(handleResponse),

  getReservationQrUrl: (id) => `${BASE_URL}/api/reservations/${id}/qr`,

  verifyReservation: (id) =>
    fetch(`${BASE_URL}/api/reservations/verify/${id}`, { headers: authHeaders() }).then(handleResponse),

  confirmAttendance: (id) =>
    fetch(`${BASE_URL}/api/reservations/${id}/confirm-attendance`, {
      method: 'PATCH',
      headers: authHeaders(),
    }).then(handleResponse),

  // --- Admin ---
  getAdminStats: () =>
    fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeaders() }).then(handleResponse),

  getAdminAnalytics: () =>
    fetch(`${BASE_URL}/api/admin/analytics`, { headers: authHeaders() }).then(handleResponse),

  getAdminUsers: () =>
    fetch(`${BASE_URL}/api/admin/users`, { headers: authHeaders() }).then(handleResponse),

  getAdminOwners: () =>
    fetch(`${BASE_URL}/api/admin/owners`, { headers: authHeaders() }).then(handleResponse),

  getOwnerCourts: (ownerId) =>
    fetch(`${BASE_URL}/api/admin/owners/${ownerId}/courts`, { headers: authHeaders() }).then(handleResponse),

  getAdminAllReservations: () =>
    fetch(`${BASE_URL}/api/admin/all-reservations`, { headers: authHeaders() }).then(handleResponse),

  getAdminCourts: () =>
    fetch(`${BASE_URL}/api/admin/courts`, { headers: authHeaders() }).then(handleResponse),

  toggleUserStatus: (id) =>
    fetch(`${BASE_URL}/api/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: authHeaders(),
    }).then(handleResponse),

  deleteAdminUser: (id) =>
    fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  toggleCourtStatus: (id) =>
    fetch(`${BASE_URL}/api/admin/courts/${id}/toggle-status`, {
      method: 'PATCH',
      headers: authHeaders(),
    }).then(handleResponse),
};
