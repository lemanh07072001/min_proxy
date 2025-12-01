'use client'

import { useState } from 'react'

import ModalAddPartner from '@/views/Client/Admin/Partner/ModalAddPartner'
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
      <ModalAddPartner open={open} onClose={handleCloseModal} type={type} partnerData={partnerData} />
    </>
  )
}
