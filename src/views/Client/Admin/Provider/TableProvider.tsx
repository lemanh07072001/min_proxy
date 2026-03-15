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

import { toast } from 'react-toastify'

import { useProviders, useDeleteProvider } from '@/hooks/apis/useProviders'
import QrCodeDialog from '@/views/Client/Admin/Provider/QrCodeDialog'
import TransactionModal from '@/views/Client/Admin/Provider/TransactionModal'

interface TableProviderProps {
  onOpenModal?: (type: 'create' | 'edit', data?: any) => void
}

export default function TableProvider({ onOpenModal }: TableProviderProps) {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [providerToDelete, setProviderToDelete] = useState<number | null>(null)
  const [providerToDeleteData, setProviderToDeleteData] = useState<any>(null)

  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false)
  const [providerToRecharge, setProviderToRecharge] = useState<any>(null)
  const [rechargeAmount, setRechargeAmount] = useState('')

  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false)
  const [providerForQrCode, setProviderForQrCode] = useState<any>(null)
  const [qrCodeAmount, setQrCodeAmount] = useState('')

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [providerForTransaction, setProviderForTransaction] = useState<any>(null)

  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const { data: dataProviders = [], isLoading } = useProviders()
  const deleteMutation = useDeleteProvider()

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
    (providerId: number) => {
      const provider = dataProviders.find((p: any) => p.id === providerId)

      console.log('Provider data when edit clicked:', provider)

      if (onOpenModal && provider) {
        onOpenModal('edit', provider)
      }
    },
    [onOpenModal, dataProviders]
  )

  const handleOpenDeleteDialog = useCallback((providerId: number) => {
    const provider = dataProviders.find((p: any) => p.id === providerId)

    setProviderToDelete(providerId)
    setProviderToDeleteData(provider)
    setDeleteDialogOpen(true)
  }, [dataProviders])

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false)
    setProviderToDelete(null)
    setProviderToDeleteData(null)
  }, [])

  const handleOpenRechargeDialog = useCallback((providerId: number) => {
    const provider = dataProviders.find((p: any) => p.id === providerId)

    setProviderToRecharge(provider)
    setRechargeAmount('')
    setRechargeDialogOpen(true)
  }, [dataProviders])

  const handleCloseRechargeDialog = useCallback(() => {
    setRechargeDialogOpen(false)
    setProviderToRecharge(null)
    setRechargeAmount('')
  }, [])

  const handleConfirmRecharge = useCallback(() => {
    if (providerToRecharge && rechargeAmount && Number(rechargeAmount) > 0) {
      // TODO: Implement API call to recharge provider
      console.log('Recharge provider:', providerToRecharge.id, 'Amount:', rechargeAmount)
      toast.success(`Nạp tiền ${new Intl.NumberFormat('vi-VN').format(Number(rechargeAmount))} đ cho nhà cung cấp thành công!`)
      handleCloseRechargeDialog()
    } else {
      toast.error('Vui lòng nhập số tiền hợp lệ')
    }
  }, [providerToRecharge, rechargeAmount, handleCloseRechargeDialog])

  const handleCloseQrCodeDialog = useCallback(() => {
    setQrCodeDialogOpen(false)
    setProviderForQrCode(null)
    setQrCodeAmount('')
  }, [])

  const handleGenerateQrCode = useCallback(() => {
    if (providerToRecharge && rechargeAmount && Number(rechargeAmount) > 0) {
      setProviderForQrCode(providerToRecharge)
      setQrCodeAmount(rechargeAmount)
      setQrCodeDialogOpen(true)
    }
  }, [providerToRecharge, rechargeAmount])

  const handleOpenTransactionModal = useCallback((providerId: number | string) => {
    const provider = dataProviders.find((p: any) => p.id === providerId)

    if (provider) {
      setProviderForTransaction(provider)
      setTransactionModalOpen(true)
    }
  }, [dataProviders])

  const handleCloseTransactionModal = useCallback(() => {
    setTransactionModalOpen(false)
    setProviderForTransaction(null)
  }, [])



  const handleConfirmDelete = useCallback(() => {
    if (providerToDelete) {
      deleteMutation.mutate(providerToDelete, {
        onSuccess: () => {
          toast.success('Xóa nhà cung cấp thành công!')
          setDeleteDialogOpen(false)
          setProviderToDelete(null)
          setProviderToDeleteData(null)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa')
        }
      })
    }
  }, [providerToDelete, deleteMutation])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },

      {
        header: 'Tên nhà cung cấp',
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
              <Tooltip title='Chỉnh sửa nhà cung cấp'>
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

              <Tooltip title='Xóa nhà cung cấp'>
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
    data: Array.isArray(dataProviders) ? dataProviders : [],
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
                <h5 className='mb-0 font-semibold'>Danh sách nhà cung cấp</h5>
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
                Thêm nhà cung cấp
              </Button>
            </div>
          </div>
          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || (Array.isArray(dataProviders) && dataProviders.length === 0) ? { height: '100%' } : {}}>
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
        <DialogTitle id='delete-dialog-title'>Xác nhận xóa nhà cung cấp</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Bạn có chắc chắn muốn xóa nhà cung cấp{' '}
            <strong>
              &quot;{providerToDeleteData?.title || providerToDeleteData?.name || 'này'}&quot;
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
        <DialogTitle id='recharge-dialog-title'>Nạp tiền cho nhà cung cấp</DialogTitle>
        <DialogContent>
          <DialogContentText id='recharge-dialog-description' sx={{ mb: 2 }}>
            Nhà cung cấp: <strong>{providerToRecharge?.title || providerToRecharge?.name || ''}</strong>
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
        provider={providerForQrCode}
        amount={qrCodeAmount}
      />

      {/* Transaction Modal - Tạm thời comment để test */}
      {transactionModalOpen && (
        <TransactionModal
          open={transactionModalOpen}
          onClose={handleCloseTransactionModal}
          providerId={providerForTransaction?.id}
          providerName={providerForTransaction?.title || providerForTransaction?.name}
        />
      )}
    </>
  )
}
