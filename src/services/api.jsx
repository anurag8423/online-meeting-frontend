import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://anurag260803.pythonanywhere.com/api',
})

// Request interceptor for auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Token ${token}`
//   }
//   return config
// })

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    toast.error(error.response?.data?.message || 'An error occurred');
    return Promise.reject(error);
  }
);


export const getMeeting = () => api.get('/meetings/')
export const createMeeting = (data) => api.post('/meetings/', data)
export const updateMeeting = (id, data) => api.put(`/meetings/${id}/`, data)
export const deleteMeeting = (id) => api.delete(`/meetings/${id}/`)

export default api

// import axios from 'axios'
// import { toast } from 'react-toastify'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
// })

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Auto-logout if 401 received
//       localStorage.removeItem('token')
//       window.location.href = '/login'
//     }
//     toast.error(error.response?.data?.message || 'An error occurred')
//     return Promise.reject(error)
//   }
// )

// export default api