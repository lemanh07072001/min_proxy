'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { CircleQuestionMark, BadgeCheck, BadgeMinus, ShoppingCart, ShoppingCartIcon, List, Copy, SquarePen, Trash2, SquarePlus, Search } from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import Pagination from '@mui/material/Pagination'

import { useQuery } from '@tanstack/react-query'

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

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useCopyServiceType, useDeleteServiceType } from '@/hooks/apis/useServiceType'
import ServiceFormModal from '@/views/Client/Admin/ServiceType/ServiceFormModal'
import ChildServiceFormModal from '@/views/Client/Admin/ServiceType/ChildServiceFormModal'
import { getTagStyle } from '@/configs/tagConfig'
import { useBranding } from '@/app/contexts/BrandingContext'

export default function TableServiceType() {
  const { isChild } = useBranding()
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<'' | 'static' | 'rotating'>('')
  const [filterStatus, setFilterStatus] = useState<'' | 'active' | 'inactive'>('')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<any>(null)

  const router = useRouter()
  const params = useParams()
  const axiosAuth = useAxiosAuth()
  const { lang: locale } = params

  const copyMutation = useCopyServiceType()
  const deleteMutation = useDeleteServiceType()

  const handleOpenCreate = useCallback(() => {
    setEditingId(null)
    setEditingData(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback(
    (row: any) => {
      setEditingId(row.id)
      setEditingData(row)
      setModalOpen(true)
    },
    []
  )

  const handleCopyService = useCallback(
    (serviceId: number) => {
      copyMutation.mutate(serviceId, {
        onSuccess: () => {
          toast.success('Sao chép dịch vụ thành công!')
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi sao chép')
        }
      })
    },
    [copyMutation]
  )

  const handleOpenDeleteDialog = useCallback((serviceId: number) => {
    setServiceToDelete(serviceId)
    setDeleteDialogOpen(true)
  }, [])

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete, {
        onSuccess: () => {
          toast.success('Xóa dịch vụ thành công!')
          handleCloseDeleteDialog()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa')
        }
      })
    }
  }, [serviceToDelete, deleteMutation, handleCloseDeleteDialog])

  const { data: dataServices = [], isLoading } = useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-service-types')

      return res.data.data
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      // case '':
      //   return <Chip label='Chờ xử lý' size='small' icon={<BadgeAlert />} color='warning' />
      case 'active':
        return <Chip label='ACTIVE' size='small' icon={<BadgeCheck />} color='success' />
      case 'inactive':
        return <Chip label='INACTIVE' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const filteredData = useMemo(() => {
    let result = dataServices

    if (searchText) {
      const lower = searchText.toLowerCase()

      result = result.filter((item: any) => item.name?.toLowerCase().includes(lower) || item.code?.toLowerCase().includes(lower))
    }

    if (filterType === 'static') {
      result = result.filter((item: any) => item.type === 0 || item.type === '0')
    } else if (filterType === 'rotating') {
      result = result.filter((item: any) => item.type === 1 || item.type === '1')
    }

    if (filterStatus) {
      result = result.filter((item: any) => item.status === filterStatus)
    }

    
return result
  }, [dataServices, searchText, filterType, filterStatus])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'ID#Code',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>
            {row.original?.id}#{row.original?.code || '—'}
          </span>
        ),
      },
      {
        header: 'Name',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{row.original?.name}</div>
          </div>
        ),
        size: 200
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {getStatusBadge(row.original.status)}
              {row.original.is_purchasable === false && (
                <Chip label='Ngừng bán' size='small' icon={<ShoppingCartIcon size={12} />} color='warning' variant='outlined' />
              )}
            </div>
          )
        },
        size: 120
      },
      {
        header: 'Nhà cung cấp',
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div className='font-bold'>{row.original?.provider?.title}</div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'Type',
        cell: ({ row }: { row: any }) => {
          const type = row.original?.type
          const displayText = type === 0 || type === '0' ? 'Tĩnh' : type === 1 || type === '1' ? 'Xoay' : type || '-'

          
return (
            <div>
              <div className='font-bold'>{displayText}</div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'Proxy Type',
        cell: ({ row }: { row: any }) => {
          const proxyType = row.original?.proxy_type

          
return (
            <div>
              <div className='font-bold'>
                {proxyType === 'residential' ? 'Dân cư' : proxyType === 'datacenter' ? 'Datacenter' : proxyType || '-'}
              </div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'IP Version',
        cell: ({ row }: { row: any }) => {
          const ipVersion = row.original?.ip_version

          
return (
            <div>
              <div className='font-bold'>
                {ipVersion === 'ipv4' ? 'IPv4' : ipVersion === 'ipv6' ? 'IPv6' : ipVersion || '-'}
              </div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'Protocols',
        cell: ({ row }: { row: any }) => {
          const protocols = row.original?.protocols

          if (!protocols || protocols.length === 0) {
            return <div>-</div>
          }

          
return (
            <div className='flex flex-wrap gap-1'>
              {protocols.map((protocol: string, index: number) => (
                <Chip
                  key={index}
                  label={protocol === 'http' ? 'HTTP' : protocol === 'socks5' ? 'SOCKS5' : protocol.toUpperCase()}
                  size='small'
                  variant='outlined'
                />
              ))}
            </div>
          )
        },
        size: 150
      },
      {
        header: 'Giá bán',
        cell: ({ row }: { row: any }) => {
          const priceData = row.original?.price_by_duration

          if (!priceData) return <div style={{ color: '#94a3b8' }}>-</div>
          let prices: any[] = []

          try {
            prices = typeof priceData === 'string' ? JSON.parse(priceData) : priceData
          } catch { return <div style={{ color: '#94a3b8' }}>-</div> }

          if (!Array.isArray(prices) || prices.length === 0) return <div style={{ color: '#94a3b8' }}>-</div>
          const durationLabels: Record<string, string> = { '1': 'Ngày', '7': 'Tuần', '30': 'Tháng' }

          
return (
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              {['1', '7', '30'].map(d => {
                const item = prices.find((p: any) => p.key === d || p.duration === d)

                if (!item) return null
                const price = new Intl.NumberFormat('vi-VN').format(parseInt(item.value || item.price || '0') || 0)

                
return (
                  <div key={d}>
                    <span style={{ color: '#64748b' }}>{durationLabels[d]}: </span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{price}đ</span>
                  </div>
                )
              })}
            </div>
          )
        },
        size: 150
      },
      {
        header: 'Tag',
        cell: ({ row }: { row: any }) => {
          const tagStr = row.original?.tag

          if (!tagStr) return <div style={{ color: '#94a3b8' }}>-</div>
          const tags = tagStr.split(',').map((t: string) => t.trim()).filter(Boolean)

          if (tags.length === 0) return <div style={{ color: '#94a3b8' }}>-</div>
          
return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {tags.map((tag: string, i: number) => {
                const style = getTagStyle(tag)

                
return (
                  <span key={i} style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', backgroundColor: style.bgColor, color: style.textColor, border: `1px solid ${style.borderColor}`, whiteSpace: 'nowrap' }}>
                    {tag}
                  </span>
                )
              })}
            </div>
          )
        },
        size: 120
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <div className='flex gap-2'>
              <Tooltip title='Chỉnh sửa dịch vụ'>
                <IconButton size='small' color='info' onClick={() => handleOpenEdit(row.original)}>
                  <SquarePen size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Sao chép dịch vụ'>
                <span>
                  <IconButton
                    size='small'
                    color='success'
                    onClick={() => handleCopyService(row.original.id)}
                    disabled={copyMutation.isPending}
                  >
                    <Copy size={18} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title='Xóa dịch vụ'>
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
        size: 100
      }
    ],
    [handleOpenEdit, handleCopyService, handleOpenDeleteDialog, copyMutation.isPending, deleteMutation.isPending]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true, // Bật tính năng chọn hàng
    onRowSelectionChange: setRowSelection, // Cập nhật state khi có thay đổi
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Tùy chọn: cần thiết nếu có bộ lọc
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
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <div className='flex justify-between align-middle w-full'>
                <h5 className='mb-0 font-semibold'>Danh sách dịch vụ</h5>
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
                Thêm dịch vụ
              </Button>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '200px', maxWidth: '300px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: '#f8fafc' }}>
              <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <input
                type='text'
                placeholder='Tìm theo tên...'
                value={searchText}
                onChange={e => { setSearchText(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })) }}
                style={{ border: 'none', outline: 'none', fontSize: '13px', padding: '8px 0', width: '100%', background: 'transparent' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {([
                { label: 'Tất cả', value: '' },
                { label: 'Tĩnh', value: 'static' },
                { label: 'Xoay', value: 'rotating' }
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterType(opt.value as any); setPagination(p => ({ ...p, pageIndex: 0 })) }}
                  style={{
                    padding: '6px 14px', fontSize: '13px', fontWeight: filterType === opt.value ? 600 : 500,
                    borderRadius: '6px',
                    border: `1px solid ${filterType === opt.value ? 'var(--mui-palette-primary-main, #7c3aed)' : '#e2e8f0'}`,
                    background: filterType === opt.value ? 'var(--mui-palette-primary-lightOpacity, rgba(124, 58, 237, 0.08))' : 'white',
                    color: filterType === opt.value ? 'var(--mui-palette-primary-main, #7c3aed)' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {([
                { label: 'Active', value: 'active', activeColor: '#22c55e', activeBg: '#f0fdf4', activeText: '#16a34a' },
                { label: 'Inactive', value: 'inactive', activeColor: '#ef4444', activeBg: '#fef2f2', activeText: '#dc2626' }
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterStatus(prev => prev === opt.value ? '' : opt.value as any); setPagination(p => ({ ...p, pageIndex: 0 })) }}
                  style={{
                    padding: '6px 14px', fontSize: '13px', fontWeight: filterStatus === opt.value ? 600 : 500,
                    borderRadius: '6px',
                    border: `1px solid ${filterStatus === opt.value ? opt.activeColor : '#e2e8f0'}`,
                    background: filterStatus === opt.value ? opt.activeBg : 'white',
                    color: filterStatus === opt.value ? opt.activeText : '#64748b',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(searchText || filterType || filterStatus) && (
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {filteredData.length} / {dataServices.length} dịch vụ
              </span>
            )}
          </div>

          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || dataServices.length === 0 ? { height: '100%' } : {}}>
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
                    <tr key={row.id} className='table-row'>
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
                  <span className='text-sm text-gray'>Kích cỡ trang linh</span>
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
                {/* --- Hiển thị số hàng trên trang hiện tại --- */}
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
        <DialogTitle id='delete-dialog-title'>Xác nhận xóa dịch vụ</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác.
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
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Form Modal — site con dùng form đơn giản, site mẹ dùng form đầy đủ */}
      {isChild ? (
        <ChildServiceFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceId={editingId}
          initialData={editingData}
        />
      ) : (
        <ServiceFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceId={editingId}
          initialData={editingData}
        />
      )}
    </>
  )
}
