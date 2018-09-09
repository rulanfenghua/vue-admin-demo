import axios from '@/config/httpConfig'

export function login() {
  return axios.get('/login')
}
