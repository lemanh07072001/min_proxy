import { authOptions } from '@/libs/auth'
import StatsOverview from '@/views/Client/Admin/Dashboard/StatsOverview'
import { getServerSession } from 'next-auth'
import axios from 'axios'

async function getDashboard(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const api = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const response = await api.get('/admin/dashboard')

    return response.data.data
  } catch (error) {
    console.error('Error fetching stats:', error)
    return null
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const data = session?.access_token ? await getDashboard(session.access_token) : null

  return (
    <>
      <StatsOverview data={data} />
    </>
  )
}
