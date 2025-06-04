import axios from 'axios'

// Storing CSRF token in memory so it automatically cleans up on page reload or navigation
let csrfToken: string | null = null

// Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies to be sent with requests
})

// Fetch CSRF token from server
const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await api.get('/auth/csrf')
    csrfToken = response.data.csrf_token
    return csrfToken
  } catch (err) {
    console.error('Failed to fetch CSRF token', err)
    return null
  }
}

// Request interceptor to add CSRF token for state-changing requests
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase()
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      if (!csrfToken) {
        await fetchCsrfToken() // Fetch if not cached
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })
        console.log('Token refreshed successfully')
        return axios(originalRequest)
      } catch (refreshError) {
        window.location.href = '/login' // Redirect to login page
        console.error('Failed to refresh token', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
export default api
