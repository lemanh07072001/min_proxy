import { authOptions } from '@/libs/auth'
import StatsOverview from '@/views/Client/Admin/Dashboard/StatsOverview'
import StatsOverviewMonthly from '@/views/Client/Admin/Dashboard/StatsOverviewMonthly'
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

async function getDashboardMonthly(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const api = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const response = await api.get('/admin/dashboard/monthly')

    return response.data.data
  } catch (error) {
    console.error('Error fetching monthly stats:', error)
    return null
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const data = session?.access_token ? await getDashboard(session.access_token) : null
  const monthlyData = session?.access_token ? await getDashboardMonthly(session.access_token) : null

  return (
    <>
      <StatsOverviewMonthly data={monthlyData} />
      <StatsOverview data={data} />
    </>
  )
}
