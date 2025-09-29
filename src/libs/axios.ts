import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.minhan.online/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'User-Agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'NextJS-Server'
  }
})

export default axiosInstance
