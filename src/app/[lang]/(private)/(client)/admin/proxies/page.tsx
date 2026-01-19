import axios from 'axios'

import ProxiesPage from '@/views/Client/Admin/Proxies/ProxiesPage'

async function getProxies(type: 'static' | 'rotating') {
  try {
    const response = await axios.get(`https://api.mktproxy.com/api/proxies?type=${type}`)

    return response.data?.data ?? []
  } catch (error) {
    console.error(`Error fetching ${type} proxies:`, error)

    return []
  }
}

export default async function Page() {
  const [staticProxies, rotatingProxies] = await Promise.all([
    getProxies('static'),
    getProxies('rotating')
  ])

  return <ProxiesPage initialData={{ static: staticProxies, rotating: rotatingProxies }} />
}
