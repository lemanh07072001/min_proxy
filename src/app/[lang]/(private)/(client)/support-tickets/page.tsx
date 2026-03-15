import type { Metadata } from 'next'

import TicketsPage from '@/views/Client/SupportTickets/TicketsPage'


export const metadata: Metadata = {
  title: 'Hỗ trợ'
}

export default function SupportTicketsPage() {
  return <TicketsPage />
}
