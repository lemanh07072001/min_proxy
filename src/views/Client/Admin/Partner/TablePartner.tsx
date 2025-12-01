'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { CircleQuestionMark, BadgeCheck, BadgeMinus, List, SquarePen, Trash2, SquarePlus, Wallet, QrCode, History } from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import Pagination from '@mui/material/Pagination'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  IconButton,
  TextField
} from '@mui/material'

import { usePartners, useDeletePartner } from '@/hooks/apis/usePartners'
import { toast } from 'react-toastify'
import QrCodeDialog from '@/views/Client/Admin/Partner/QrCodeDialog'
import TransactionModal from '@/views/Client/Admin/Partner/TransactionModal'

interface TablePartnerProps {
  onOpenModal?: (type: 'create' | 'edit', data?: any) => void
}

export default function TablePartner({ onOpenModal }: TablePartnerProps) {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null)
  const [partnerToDeleteData, setPartnerToDeleteData] = useState<any>(null)

  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false)
  const [partnerToRecharge, setPartnerToRecharge] = useState<any>(null)
  const [rechargeAmount, setRechargeAmount] = useState('')

  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false)
  const [partnerForQrCode, setPartnerForQrCode] = useState<any>(null)
  const [qrCodeAmount, setQrCodeAmount] = useState('')

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [partnerForTransaction, setPartnerForTransaction] = useState<any>(null)

  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const { data: dataPartners = [], isLoading } = usePartners()
  const deleteMutation = useDeletePartner()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label='ACTIVE' size='small' icon={<BadgeCheck />} color='success' />
      case 'inactive':
        return <Chip label='INACTIVE' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }


  const handleOpenCreate = useCallback(() => {
    if (onOpenModal) {
      onOpenModal('create')
    }
  }, [onOpenModal])

  const handleOpenEdit = useCallback(
    (partnerId: number) => {
      const partner = dataPartners.find((p: any) => p.id === partnerId)
      console.log('Partner data when edit clicked:', partner)
      if (onOpenModal && partner) {
        onOpenModal('edit', partner)
      }
    },
    [onOpenModal, dataPartners]
  )

  const handleOpenDeleteDialog = useCallback((partnerId: number) => {
    const partner = dataPartners.find((p: any) => p.id === partnerId)
    setPartnerToDelete(partnerId)
    setPartnerToDeleteData(partner)
    setDeleteDialogOpen(true)
  }, [dataPartners])

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false)
    setPartnerToDelete(null)
    setPartnerToDeleteData(null)
  }, [])

  const handleOpenRechargeDialog = useCallback((partnerId: number) => {
    const partner = dataPartners.find((p: any) => p.id === partnerId)
    setPartnerToRecharge(partner)
    setRechargeAmount('')
    setRechargeDialogOpen(true)
  }, [dataPartners])

  const handleCloseRechargeDialog = useCallback(() => {
    setRechargeDialogOpen(false)
    setPartnerToRecharge(null)
    setRechargeAmount('')
  }, [])

  const handleConfirmRecharge = useCallback(() => {
    if (partnerToRecharge && rechargeAmount && Number(rechargeAmount) > 0) {
      // TODO: Implement API call to recharge partner
      console.log('Recharge partner:', partnerToRecharge.id, 'Amount:', rechargeAmount)
      toast.success(`Nạp tiền ${new Intl.NumberFormat('vi-VN').format(Number(rechargeAmount))} đ cho đối tác thành công!`)
      handleCloseRechargeDialog()
    } else {
      toast.error('Vui lòng nhập số tiền hợp lệ')
    }
  }, [partnerToRecharge, rechargeAmount, handleCloseRechargeDialog])

  const handleCloseQrCodeDialog = useCallback(() => {
    setQrCodeDialogOpen(false)
    setPartnerForQrCode(null)
    setQrCodeAmount('')
  }, [])

  const handleGenerateQrCode = useCallback(() => {
    if (partnerToRecharge && rechargeAmount && Number(rechargeAmount) > 0) {
      setPartnerForQrCode(partnerToRecharge)
      setQrCodeAmount(rechargeAmount)
      setQrCodeDialogOpen(true)
    }
  }, [partnerToRecharge, rechargeAmount])

  const handleOpenTransactionModal = useCallback((partnerId: number | string) => {
    const partner = dataPartners.find((p: any) => p.id === partnerId)
    if (partner) {
      setPartnerForTransaction(partner)
      setTransactionModalOpen(true)
    }
  }, [dataPartners])

  const handleCloseTransactionModal = useCallback(() => {
    setTransactionModalOpen(false)
    setPartnerForTransaction(null)
  }, [])



  const handleConfirmDelete = useCallback(() => {
    if (partnerToDelete) {
      deleteMutation.mutate(partnerToDelete, {
        onSuccess: () => {
          toast.success('Xóa đối tác thành công!')
          setDeleteDialogOpen(false)
          setPartnerToDelete(null)
          setPartnerToDeleteData(null)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa')
        }
      })
    }
  }, [partnerToDelete, deleteMutation])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      
      {
        header: 'Tên đối tác',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{row.original?.title || row.original?.name || '-'}</div>
          </div>
        ),
        size: 1000,
        minSize: 200
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          return getStatusBadge(row.original?.status)
        },
        size: 120
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <div className='flex gap-2'>
              <Tooltip title='Chỉnh sửa đối tác'>
                <IconButton size='small' color='info' onClick={() => handleOpenEdit(row.original.id)}>
                  <SquarePen size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Nạp tiền'>
                <IconButton
                  size='small'
                  color='success'
                  onClick={() => handleOpenRechargeDialog(row.original.id)}
                >
                  <Wallet size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Lịch sử giao dịch'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleOpenTransactionModal(row.original.id)}
                >
                  <History size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Xóa đối tác'>
                <span>
                  <IconButton
                    size='small'
                    color='error'
                    onClick={() => handleOpenDeleteDialog(row.original.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          )
        },
        size: 180
      }
    ],
    [handleOpenEdit, handleOpenDeleteDialog, handleOpenRechargeDialog, handleOpenTransactionModal, deleteMutation.isPending]
  )

  const table = useReactTable({
    data: Array.isArray(dataPartners) ? dataPartners : [],
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  return (
    <>
      <div className='orders-content'>
        <div className='table-container'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <div className='flex justify-between align-middle w-full'>
                <h5 className='mb-0 font-semibold'>Danh sách đối tác</h5>
              </div>
            </div>

            <div className='header-right'>
              <Button
                onClick={handleOpenCreate}
                variant='contained'
                color='primary'
                className='text-white'
                size='small'
                startIcon={<SquarePlus size={16} />}
              >
                Thêm đối tác
              </Button>
            </div>
          </div>
          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || (Array.isArray(dataPartners) && dataPartners.length === 0) ? { height: '100%' } : {}}>
              <thead className='table-header'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th style={{ width: header.getSize() }} className='table-header th' key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='loader-wrapper'>
                        <div className='loader'>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <p className='loading-text'>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                        <p className='mt-4 text-gray-500'>Không có dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr className='table-row' key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td className='table-cell' key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <div className='pagination-info'>
                <div className='page-size-select'>
                  <span className='text-sm text-gray'>Kích cỡ trang</span>
                  <div className='page-size-select-wrapper'>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={e => {
                        table.setPageSize(Number(e.target.value))
                      }}
                      className='page-size-select'
                    >
                      <option value='10'>10</option>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                    </select>
                    <div className='select-arrow'>
                      <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  {totalRows > 0 ? (
                    <span>
                      {startRow} - {endRow} của {totalRows} hàng
                    </span>
                  ) : (
                    <span>Không có dữ liệu</span>
                  )}
                </div>
              </div>

              <div className='pagination-buttons'>
                <Pagination
                  count={table.getPageCount()}
                  shape='rounded'
                  variant='outlined'
                  color='primary'
                  page={table.getState().pagination.pageIndex + 1}
                  onChange={(event, page) => {
                    table.setPageIndex(page - 1)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Xác nhận xóa đối tác</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Bạn có chắc chắn muốn xóa đối tác{' '}
            <strong>
              "{partnerToDeleteData?.title || partnerToDeleteData?.name || 'này'}"
            </strong>{' '}
            không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' disabled={deleteMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant='contained'
            color='error'
            disabled={deleteMutation.isPending}
            autoFocus
            sx={{ color: '#fff' }}
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recharge Dialog */}
      <Dialog
        open={rechargeDialogOpen}
        onClose={handleCloseRechargeDialog}
        aria-labelledby='recharge-dialog-title'
        aria-describedby='recharge-dialog-description'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='recharge-dialog-title'>Nạp tiền cho đối tác</DialogTitle>
        <DialogContent>
          <DialogContentText id='recharge-dialog-description' sx={{ mb: 2 }}>
            Đối tác: <strong>{partnerToRecharge?.title || partnerToRecharge?.name || ''}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Số tiền nạp'
            type='text'
            fullWidth
            variant='outlined'
            value={rechargeAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              setRechargeAmount(value)
            }}
            InputProps={{
              endAdornment: <span style={{ marginLeft: '8px' }}>đ</span>
            }}
            helperText={
              rechargeAmount
                ? `Số tiền: ${new Intl.NumberFormat('vi-VN').format(Number(rechargeAmount))} đ`
                : 'Nhập số tiền cần nạp'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRechargeDialog} variant='outlined'>
            Hủy
          </Button>
          <Button
            onClick={handleGenerateQrCode}
            variant='outlined'
            color='warning'
            disabled={!rechargeAmount || Number(rechargeAmount) <= 0}
            startIcon={<QrCode size={18} />}
          >
            Tạo QR code
          </Button>
          <Button
            onClick={handleConfirmRecharge}
            variant='contained'
            color='success'
            disabled={!rechargeAmount || Number(rechargeAmount) <= 0}
            sx={{ color: '#fff' }}
          >
            Nạp tiền
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <QrCodeDialog
        open={qrCodeDialogOpen}
        onClose={handleCloseQrCodeDialog}
        partner={partnerForQrCode}
        amount={qrCodeAmount}
      />

      {/* Transaction Modal - Tạm thời comment để test */}
      {transactionModalOpen && (
        <TransactionModal
          open={transactionModalOpen}
          onClose={handleCloseTransactionModal}
          partnerId={partnerForTransaction?.id}
          partnerName={partnerForTransaction?.title || partnerForTransaction?.name}
        />
      )}
    </>
  )
}

