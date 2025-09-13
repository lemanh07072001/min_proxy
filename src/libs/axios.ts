import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://mktproxy.com/api',
  headers: {
    Accept: 'application/json'
  }
})

export default axiosInstance
