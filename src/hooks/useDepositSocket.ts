'use client'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

import { useUserStore } from '@/stores'

interface DepositSuccessData {
  user_id: number
  amount: number
  new_balance: number
  gateway: string
  tid: string
  time: string
}

export function useDepositSocket() {
  const { data: session } = useSession() as any
  const addBalance = useUserStore(state => state.addBalance)
  const setBalance = useUserStore(state => state.setBalance)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    if (!session?.user?.id) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.mktproxy.com'
    const socket = io(socketUrl, {
      transports: ['websocket'],
      secure: true
    })

    socket.on('deposit_success', (data: DepositSuccessData) => {
      // Chỉ xử lý nếu đúng user đang đăng nhập
      if (data.user_id !== session.user.id) return

      // Cập nhật balance trong store
      setBalance(data.new_balance)

      // Hiển thị toast thông báo
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(data.amount)

      toast.success(
        `Nạp tiền thành công! +${formatted}\nGD: ${data.tid} · ${data.gateway}`,
        {
          autoClose: 5000,
          position: 'top-right'
        }
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [session?.user?.id, setBalance])
}
