import { getServerSession } from 'next-auth'

import type { Metadata } from 'next'

import axiosInstance from '@/libs/axios'
import ProfilePage from '@/views/Client/Profile/ProfilePage'
import { authOptions } from '@/libs/auth'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Thông tin tài khoản`
}

const getProfile = async (id: number, token: string) => {
  const response = await fetch(`${process.env.API_URL}/profile/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Lỗi khi lấy dữ liệu!')
  }

  const data = await response.json()

  return data
}

export default async function Profile() {
  const session = await getServerSession(authOptions)
  const token = session.access_token
  const id = session.user.id

  const dataUser = await getProfile(id, token)

  return (
    <>
      <ProfilePage dataProfile={dataUser} />
    </>
  )
}
