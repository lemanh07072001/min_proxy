'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { CircleQuestionMark, BadgeCheck, BadgeMinus, List, Copy, SquarePen, Trash2, SquarePlus } from 'lucide-react'

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

import useAxiosAuth from '@/hooks/useAxiosAuth'
import { useCopyServiceType, useDeleteServiceType } from '@/hooks/apis/useServiceType'

export default function TableServiceType() {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState<any[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)

  const router = useRouter()
  const params = useParams()
  const axiosAuth = useAxiosAuth()
  const { lang: locale } = params

  const copyMutation = useCopyServiceType()
  const deleteMutation = useDeleteServiceType()

  const handleOpenCreate = useCallback(() => {
    router.push(`/${locale}/admin/service-type/create`)
  }, [router, locale])

  const handleOpenEdit = useCallback(
    (serviceId: number) => {
      router.push(`/${locale}/admin/service-type/edit/${serviceId}`)
    },
    [router, locale]
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

  const getRowTooltipContent = (rowData: any) => {
    if (!rowData?.price_by_duration) {
      return (
        <div style={{ padding: '4px 0', color: '#999' }}>Chưa có thông tin giá</div>
      )
    }

    // Parse price_by_duration nếu là string JSON
    let priceDurations: any[] = []

    try {
      priceDurations =
        typeof rowData.price_by_duration === 'string'
          ? JSON.parse(rowData.price_by_duration)
          : rowData.price_by_duration
    } catch (error) {
      return <div style={{ padding: '4px 0', color: '#f44336' }}>Lỗi định dạng dữ liệu giá</div>
    }

    if (!Array.isArray(priceDurations) || priceDurations.length === 0) {
      return (
        <div style={{ padding: '4px 0', color: '#999' }}>Chưa có thông tin giá</div>
      )
    }

    // Định nghĩa các khoảng thời gian cần hiển thị
    const durationMap: { [key: string]: { label: string; icon: string } } = {
      '1': { label: '1 ngày', icon: '📅' },
      '7': { label: '1 tuần', icon: '📆' },
      '30': { label: '1 tháng', icon: '🗓️' }
    }

    const tooltipItems: JSX.Element[] = []

    // Tìm và hiển thị giá cho từng khoảng thời gian
    ;['1', '7', '30'].forEach((duration, index) => {
      const priceItem = priceDurations.find(
        (item: any) => item.key === duration || item.duration === duration
      )

      if (priceItem) {
        const price = priceItem.value || priceItem.price || '0'
        const cost = priceItem.cost || '0'
        const priceFormatted = new Intl.NumberFormat('vi-VN').format(parseInt(price) || 0)
        const costFormatted = new Intl.NumberFormat('vi-VN').format(parseInt(cost) || 0)
        const durationInfo = durationMap[duration]

        tooltipItems.push(
          <div
            key={duration}
            style={{
              padding: '8px 0',
              borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff'
              }}
            >
              <span style={{ marginRight: '6px', fontSize: '14px' }}>{durationInfo.icon}</span>
              <span>{durationInfo.label}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#90caf9', marginRight: '8px', minWidth: '70px' }}>
                  Giá bán:
                </span>
                <span style={{ color: '#4caf50', fontWeight: 600 }}>
                  {priceFormatted} đ
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#90caf9', marginRight: '8px', minWidth: '70px' }}>
                  Giá cost:
                </span>
                <span style={{ color: '#ff9800', fontWeight: 600 }}>
                  {costFormatted} đ
                </span>
              </div>
            </div>
          </div>
        )
      }
    })

    return tooltipItems.length > 0 ? (
      <div
        style={{
          padding: '8px 4px',
          minWidth: '200px',
          maxWidth: '280px'
        }}
      >
        {tooltipItems}
      </div>
    ) : (
      <div style={{ padding: '4px 0', color: '#999' }}>Chưa có thông tin giá</div>
    )
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 20
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
          return getStatusBadge(row.original.status)
        },
        size: 100
      },
      {
        header: 'Đối tác',
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div className='font-bold'>{row.original?.partner?.title}</div>
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
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <div className='flex gap-2'>
              <Tooltip title='Chỉnh sửa dịch vụ'>
                <IconButton size='small' color='info' onClick={() => handleOpenEdit(row.original.id)}>
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
    data: dataServices,
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
                    <Tooltip
                      key={row.id}
                      title={getRowTooltipContent(row.original)}
                      arrow
                      placement='top'
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: 'rgba(30, 30, 30, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            maxWidth: 'none',
                            fontSize: '12px'
                          }
                        },
                        arrow: {
                          sx: {
                            color: 'rgba(30, 30, 30, 0.95)',
                            '&::before': {
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }}
                    >
                      <tr className='table-row'>
                        {row.getVisibleCells().map(cell => (
                          <td className='table-cell' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    </Tooltip>
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
    </>
  )
}
