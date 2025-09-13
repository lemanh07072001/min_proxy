import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.mktproxy.com/api',
  headers: {
    Accept: 'application/json'
  }
})

export default axiosInstance
