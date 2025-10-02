'use client'

import { useState } from 'react'

import { Button } from '@mui/material'

import ModalAddPartner from '@/app/[lang]/(private)/(client)/admin/partner/ModalAddPartner'

export default function AdminPartnerPage() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('create')

  const handleOpenAddModal = () => {
    setOpen(true)
    setType('create')
  }

  const handleCloseAddModal = () => setOpen(false)

  return (
    <>
      <div className='mb-8 flex justify-end'>
        <Button
          onClick={handleOpenAddModal}
          sx={{ color: '#fff' }}
          variant='contained'
          startIcon={<i className='tabler-send' />}
        >
          Thêm đối tác
        </Button>
      </div>

      <ModalAddPartner open={open} onClose={handleCloseAddModal} type={type} />
    </>
  )
}
