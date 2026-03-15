'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'

import { List, SquarePen, Trash2, SquarePlus, BadgeCheck, BadgeMinus, CircleQuestionMark } from 'lucide-react'

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
  IconButton
} from '@mui/material'

import { toast } from 'react-toastify'

import { usePartners, useDeletePartner } from '@/hooks/apis/usePartners'

interface TablePartnerProps {
  onOpenModal?: (type: 'create' | 'edit', data?: any) => void
}

export default function TablePartner({ onOpenModal }: TablePartnerProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<any>(null)

  const { data: dataPartners = [], isLoading } = usePartners()
  const deleteMutation = useDeletePartner()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label='ACTIVE' size='small' icon={<BadgeCheck />} color='success' />
      case 'inactive':
        return <Chip label='INACTIVE' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='N/A' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const handleOpenCreate = useCallback(() => onOpenModal?.('create'), [onOpenModal])

  const handleOpenEdit = useCallback(
    (id: number) => {
      const partner = dataPartners.find((p: any) => p.id === id)

      if (partner) onOpenModal?.('edit', partner)
    },
    [onOpenModal, dataPartners]
  )

  const handleConfirmDelete = useCallback(() => {
    if (partnerToDelete) {
      deleteMutation.mutate(partnerToDelete.id, {
        onSuccess: () => {
          toast.success('Xóa đối tác thành công!')
          setDeleteDialogOpen(false)
          setPartnerToDelete(null)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa')
        }
      })
    }
  }, [partnerToDelete, deleteMutation])

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 60 },
      {
        header: 'Logo',
        cell: ({ row }: { row: any }) => {
          const logoUrl = row.original?.logo_url

          return logoUrl ? (
            <Image src={logoUrl} alt='' width={60} height={30} style={{ objectFit: 'contain' }} />
          ) : (
            <span className='text-gray-400'>—</span>
          )
        },
        size: 80
      },
      {
        header: 'Tên đối tác',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{row.original?.name || '-'}</div>
            <div className='text-xs text-gray-500'>{row.original?.subtitle || ''}</div>
          </div>
        ),
        size: 300
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => getStatusBadge(row.original?.status),
        size: 120
      },
      {
        header: 'Thứ tự',
        accessorKey: 'order',
        size: 80
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => (
          <div className='flex gap-2'>
            <Tooltip title='Chỉnh sửa'>
              <IconButton size='small' color='info' onClick={() => handleOpenEdit(row.original.id)}>
                <SquarePen size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Xóa'>
              <IconButton
                size='small'
                color='error'
                onClick={() => {
                  setPartnerToDelete(row.original)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          </div>
        ),
        size: 120
      }
    ],
    [handleOpenEdit]
  )

  const table = useReactTable({
    data: Array.isArray(dataPartners) ? dataPartners : [],
    columns,
    state: { rowSelection, pagination, columnFilters, sorting },
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
              <h5 className='mb-0 font-semibold'>Quản lý đối tác</h5>
            </div>
            <div className='header-right'>
              <Button onClick={handleOpenCreate} variant='contained' color='primary' className='text-white' size='small' startIcon={<SquarePlus size={16} />}>
                Thêm đối tác
              </Button>
            </div>
          </div>

          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || dataPartners.length === 0 ? { height: '100%' } : {}}>
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
                        <div className='loader'><span></span><span></span><span></span></div>
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

          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <div className='pagination-info'>
                <div className='page-size-select'>
                  <span className='text-sm text-gray'>Kích cỡ trang</span>
                  <div className='page-size-select-wrapper'>
                    <select value={pageSize} onChange={e => table.setPageSize(Number(e.target.value))} className='page-size-select'>
                      <option value='10'>10</option>
                      <option value='50'>50</option>
                    </select>
                  </div>
                </div>
                <div>{totalRows > 0 ? <span>{startRow} - {endRow} của {totalRows} hàng</span> : <span>Không có dữ liệu</span>}</div>
              </div>
              <div className='pagination-buttons'>
                <Pagination count={table.getPageCount()} shape='rounded' variant='outlined' color='primary' page={pageIndex + 1} onChange={(_, page) => table.setPageIndex(page - 1)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa đối tác</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa đối tác <strong>&quot;{partnerToDelete?.name}&quot;</strong> không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='outlined' disabled={deleteMutation.isPending}>Hủy</Button>
          <Button onClick={handleConfirmDelete} variant='contained' color='error' disabled={deleteMutation.isPending} sx={{ color: '#fff' }}>
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
