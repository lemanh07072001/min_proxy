'use client'

import { useState } from 'react'

import PartnerFormModal from '@/views/Client/Admin/Partner/PartnerFormModal'
import TablePartner from '@/views/Client/Admin/Partner/TablePartner'

export default function AdminPartnerPage() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'create' | 'edit'>('create')
  const [partnerData, setPartnerData] = useState<any>(null)

  const handleOpenModal = (modalType: 'create' | 'edit', data?: any) => {
    setType(modalType)
    setPartnerData(data || null)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setPartnerData(null)
  }

  return (
    <>
      <TablePartner onOpenModal={handleOpenModal} />
      <PartnerFormModal open={open} onClose={handleCloseModal} type={type} partnerData={partnerData} />
    </>
  )
}
