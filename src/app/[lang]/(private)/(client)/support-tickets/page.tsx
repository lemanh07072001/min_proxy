import TicketsPage from '@/views/Client/SupportTickets/TicketsPage'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Hỗ trợ`
}

export default function SupportTicketsPage() {
  return <TicketsPage />
}
