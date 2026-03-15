'use client'

import { useState, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { useBranding } from '@/app/contexts/BrandingContext'
import ModalAddProvider from '@/views/Client/Admin/Provider/ModalAddProvider'
import TableProvider from '@/views/Client/Admin/Provider/TableProvider'

export default function AdminProviderPage() {
  const { isChild } = useBranding()
  const router = useRouter()
  const { lang: locale } = useParams()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'create' | 'edit'>('create')
  const [providerData, setProviderData] = useState<any>(null)

  // Site con không có quyền truy cập nhà cung cấp
  useEffect(() => {
    if (isChild) {
      router.replace(`/${locale}/home`)
    }
  }, [isChild, router, locale])

  const handleOpenModal = (modalType: 'create' | 'edit', data?: any) => {
    setType(modalType)
    setProviderData(data || null)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setProviderData(null)
  }

  if (isChild) return null

  return (
    <>
      <TableProvider onOpenModal={handleOpenModal} />
      <ModalAddProvider open={open} onClose={handleCloseModal} type={type} providerData={providerData} />
    </>
  )
}
