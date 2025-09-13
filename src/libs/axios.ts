import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'User-Agent': navigator.userAgent
  }
})

export default axiosInstance
