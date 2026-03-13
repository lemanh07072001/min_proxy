'use client'

import { useState } from 'react'

import ModalAddReseller from '@/views/Client/Admin/Reseller/ModalAddReseller'
import ModalCredentials from '@/views/Client/Admin/Reseller/ModalCredentials'
import TableReseller from '@/views/Client/Admin/Reseller/TableReseller'

export default function AdminResellerPage() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'create' | 'edit'>('create')
  const [resellerData, setResellerData] = useState<any>(null)

  const [credentialsOpen, setCredentialsOpen] = useState(false)
  const [credentialsReseller, setCredentialsReseller] = useState<any>(null)

  const handleOpenModal = (modalType: 'create' | 'edit', data?: any) => {
    setType(modalType)
    setResellerData(data || null)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setResellerData(null)
  }

  const handleViewCredentials = (reseller: any) => {
    setCredentialsReseller(reseller)
    setCredentialsOpen(true)
  }

  const handleCloseCredentials = () => {
    setCredentialsOpen(false)
    setCredentialsReseller(null)
  }

  return (
    <>
      <TableReseller onOpenModal={handleOpenModal} onViewCredentials={handleViewCredentials} />
      <ModalAddReseller open={open} onClose={handleCloseModal} type={type} resellerData={resellerData} />
      <ModalCredentials open={credentialsOpen} onClose={handleCloseCredentials} reseller={credentialsReseller} />
    </>
  )
}
