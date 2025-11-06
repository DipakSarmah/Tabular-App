import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api' || '/api',
})

// --- CRUD Functions ---

export const getAll = () => api.get('/data')

export const createRecord = (data) => api.post('/data', data)

export const updateRecord = (id, data) => api.put(`/data/${id}`, data)

export const deleteRecord = (id) => api.delete(`/data/${id}`)

export const getMeta = () => api.get('/meta')

export default api
