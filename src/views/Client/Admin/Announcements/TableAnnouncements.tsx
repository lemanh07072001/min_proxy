'use client'

import { useState, useMemo, useCallback } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef
} from '@tanstack/react-table'
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip
} from '@mui/material'
import { List, SquarePlus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

import { useAdminAnnouncements, useDeleteAnnouncement } from '@/hooks/apis/useAnnouncements'
import type { Announcement } from '@/hooks/apis/useAnnouncements'
import ModalAddAnnouncement from './ModalAddAnnouncement'

const TYPE_LABELS: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'error' | 'default' }> = {
  discount: { label: 'Giảm giá', color: 'success' },
  new_product: { label: 'Sản phẩm mới', color: 'info' },
  price_change: { label: 'Thay đổi giá', color: 'warning' },
  maintenance: { label: 'Bảo trì', color: 'error' },
  general: { label: 'Chung', color: 'default' }
}

const COLOR_MAP: Record<string, string> = {
  'bg-green-500': '#22c55e',
  'bg-blue-500': '#3b82f6',
  'bg-yellow-500': '#eab308',
  'bg-red-500': '#ef4444',
  'bg-teal-500': '#14b8a6',
  'bg-purple-500': '#a855f7',
  'bg-pink-500': '#ec4899'
}

export default function TableAnnouncements() {
  const [page, setPage] = useState(1)
  const { data: paginatedData, isLoading } = useAdminAnnouncements(page)
  const deleteMutation = useDeleteAnnouncement()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editData, setEditData] = useState<Announcement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)

  const announcements: Announcement[] = paginatedData?.data ?? []
  const totalPages = paginatedData?.last_page ?? 1

  const handleOpenCreate = useCallback(() => {
    setModalType('create')
    setEditData(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((row: Announcement) => {
    setModalType('edit')
    setEditData(row)
    setModalOpen(true)
  }, [])

  const handleOpenDelete = useCallback((row: Announcement) => {
    setDeleteTarget(row)
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('Xóa thông báo thành công')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa')
    }

    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [deleteTarget, deleteMutation])

  const columns = useMemo<ColumnDef<Announcement>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 60,
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '13px' }}>
            #{getValue() as number}
          </span>
        )
      },
      {
        header: 'Màu',
        accessorKey: 'color',
        size: 50,
        cell: ({ getValue }) => {
          const hex = COLOR_MAP[getValue() as string] ?? '#94a3b8'

          return (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: hex,
                display: 'inline-block',
                boxShadow: `0 2px 6px ${hex}50`,
                border: '2px solid white'
              }}
            />
          )
        }
      },
      {
        header: 'Tiêu đề',
        accessorKey: 'title',
        size: 250,
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
            {getValue() as string}
          </span>
        )
      },
      {
        header: 'Loại',
        accessorKey: 'type',
        size: 120,
        cell: ({ getValue }) => {
          const type = getValue() as string
          const config = TYPE_LABELS[type] ?? TYPE_LABELS.general

          return <Chip label={config.label} color={config.color} size='small' variant='outlined' />
        }
      },
      {
        header: 'Hiển thị',
        accessorKey: 'display_type',
        size: 120,
        cell: ({ getValue }) => {
          const dt = getValue() as string

          return (
            <Chip
              label={dt === 'modal' ? 'Popup' : 'Trang chủ'}
              color={dt === 'modal' ? 'secondary' : 'primary'}
              size='small'
              variant='outlined'
            />
          )
        }
      },
      {
        header: 'Trạng thái',
        accessorKey: 'is_active',
        size: 100,
        cell: ({ getValue }) => (
          <Chip
            label={getValue() ? 'Hiển thị' : 'Ẩn'}
            color={getValue() ? 'success' : 'default'}
            size='small'
          />
        )
      },
      {
        header: 'Ngày đăng',
        accessorKey: 'published_at',
        size: 160,
        cell: ({ getValue }) => {
          const val = getValue() as string

          return (
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              {val ? new Date(val).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '—'}
            </span>
          )
        }
      },
      {
        header: 'Thao tác',
        id: 'actions',
        size: 100,
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 4 }}>
            <Tooltip title='Sửa'>
              <IconButton
                size='small'
                onClick={() => handleOpenEdit(row.original)}
                sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }}
              >
                <Pencil size={15} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Xóa'>
              <IconButton
                size='small'
                onClick={() => handleOpenDelete(row.original)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
              >
                <Trash2 size={15} />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    ],
    [handleOpenEdit, handleOpenDelete]
  )

  const table = useReactTable({
    data: announcements,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages
  })

  return (
    <div className='orders-content'>
      <div className='table-container'>
        <div className='table-toolbar'>
          <div className='header-left'>
            <div className='page-icon'>
              <List size={17} />
            </div>
            <h5 style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>Quản lý thông báo</h5>
          </div>
          <div className='header-right'>
            <Button
              onClick={handleOpenCreate}
              variant='contained'
              size='small'
              startIcon={<SquarePlus size={16} />}
              sx={{
                background: 'linear-gradient(45deg, #fc4336, #f88a4b)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(252, 67, 54, 0.3)',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                '&:hover': { background: 'linear-gradient(45deg, #e53e2f, #e07840)', boxShadow: '0 6px 16px rgba(252, 67, 54, 0.4)' }
              }}
            >
              Thêm thông báo
            </Button>
          </div>
        </div>

        <div className='table-wrapper'>
          <table className='data-table'>
            <thead className='table-header'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='table-cell' style={{ width: header.getSize() }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className='table-cell' style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    Đang tải...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='table-cell' style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    Chưa có thông báo nào
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className='table-row'>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='table-cell'>
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
        {totalPages > 1 && (
          <div className='pagination-container'>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', padding: '12px 0' }}>
              <Button
                size='small'
                variant='outlined'
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                sx={{ fontSize: '13px', textTransform: 'none' }}
              >
                Trước
              </Button>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Trang {page} / {totalPages}
              </span>
              <Button
                size='small'
                variant='outlined'
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                sx={{ fontSize: '13px', textTransform: 'none' }}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      <ModalAddAnnouncement
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={editData}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thông báo &quot;{deleteTarget?.title}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='outlined'>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            variant='contained'
            color='error'
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
