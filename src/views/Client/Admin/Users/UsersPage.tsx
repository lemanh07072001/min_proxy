'use client'

import { useState } from 'react'

import TableUsers from '@/views/Client/Admin/Users/TableUsers'
import ModalEditUser from '@/views/Client/Admin/Users/ModalEditUser'
import ModalBalanceAdjust from '@/views/Client/Admin/Users/ModalBalanceAdjust'
import UserTransactionModal from '@/views/Client/Admin/Users/UserTransactionModal'

export default function UsersPage() {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [balanceModalOpen, setBalanceModalOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleAdjustBalance = (user: any) => {
    setSelectedUser(user)
    setBalanceModalOpen(true)
  }

  const handleViewTransactions = (user: any) => {
    setSelectedUser(user)
    setTransactionModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleCloseBalanceModal = () => {
    setBalanceModalOpen(false)
    setSelectedUser(null)
  }

  const handleCloseTransactionModal = () => {
    setTransactionModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <>
      <TableUsers
        onEditUser={handleEditUser}
        onAdjustBalance={handleAdjustBalance}
        onViewTransactions={handleViewTransactions}
      />
      <ModalEditUser open={editModalOpen} onClose={handleCloseEditModal} userData={selectedUser} />
      <ModalBalanceAdjust open={balanceModalOpen} onClose={handleCloseBalanceModal} userData={selectedUser} />
      <UserTransactionModal
        open={transactionModalOpen}
        onClose={handleCloseTransactionModal}
        userId={selectedUser?.id}
        userName={`${selectedUser?.name || ''} (${selectedUser?.email || ''})`}
      />
    </>
  )
}
