import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach JWT or demo token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('aivoa_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refresh_token: refresh })
          localStorage.setItem('access_token', res.data.access_token)
          original.headers.Authorization = `Bearer ${res.data.access_token}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (data) => api.post('/api/auth/register', data),
  refresh: (refresh_token) => api.post('/api/auth/refresh', { refresh_token }),
  me: () => api.get('/api/auth/me'),
}

export const hcpAPI = {
  list: () => api.get('/api/hcp/'),
  search: (q) => api.get(`/api/hcp/search?q=${encodeURIComponent(q)}`),
  get: (id) => api.get(`/api/hcp/${id}`),
  create: (data) => api.post('/api/hcp/', data),
  update: (id, data) => api.put(`/api/hcp/${id}`, data),
  delete: (id) => api.delete(`/api/hcp/${id}`),
}

export const interactionAPI = {
  list: (skip = 0, limit = 50) => api.get(`/api/interactions/?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/interactions/${id}`),
  create: (data) => api.post('/api/interactions/', data),
  update: (id, data) => api.put(`/api/interactions/${id}`, data),
  delete: (id) => api.delete(`/api/interactions/${id}`),
}

export const agentAPI = {
  chat: (message, sessionId, interactionId = null) =>
    api.post('/api/agent/chat', { message, session_id: sessionId, interaction_id: interactionId, stream: false }),
  clearSession: (sessionId) => api.delete(`/api/agent/session/${sessionId}`),
  getHistory: (sessionId) => api.get(`/api/agent/session/${sessionId}/history`),
  streamUrl: (BASE_URL) => `${BASE_URL}/api/agent/chat`,
}

export const voiceAPI = {
  transcribe: (audioBlob) => {
    const form = new FormData()
    form.append('file', audioBlob, 'recording.webm')
    return api.post('/api/voice/transcribe', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export const analyticsAPI = {
  dashboard: () => api.get('/api/analytics/dashboard'),
  hcpTimeline: (hcpId) => api.get(`/api/analytics/hcp/${hcpId}/timeline`),
}

export { BASE_URL }
export default api