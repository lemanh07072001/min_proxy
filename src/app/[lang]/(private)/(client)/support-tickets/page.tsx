import type { Metadata } from 'next'

import TicketsPage from '@/views/Client/SupportTickets/TicketsPage'


export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Hỗ trợ`
}

export default function SupportTicketsPage() {
  return <TicketsPage />
}
