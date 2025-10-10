'use client'

import React, { useMemo, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  Chip,
  Pagination,
  FormControlLabel
} from '@mui/material'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import Checkbox from '@mui/material/Checkbox'
import {
  Copy,
  Clock,
  Clock3,
  BadgeCheck,
  BadgeAlert,
  BadgeMinus,
  CircleQuestionMark,
  Eye,
  FileDown
} from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'
import CustomIconButton from '@core/components/mui/IconButton'
import DetailProxy from './DetaiProxy'

// Badge trạng thái
const getStatusBadge = (status: string) => {
  switch (status) {
    case '0':
      return <Chip label='Chờ xử lý' size='small' icon={<BadgeAlert />} color='warning' />
    case '2':
      return <Chip label='Hoàn thành' size='small' icon={<BadgeCheck />} color='success' />
    case '5':
      return <Chip label='Hết hạn' size='small' icon={<BadgeMinus />} color='error' />
    default:
      return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
  }
}

interface ProxyItem {
  id: string
  proxys: {
    loaiproxy?: string
    [key: string]: any
  }
  buy_at: string
  expired_at: string
  status: string
}

interface OrderDetailProps {
  open: boolean
  onClose: () => void
  order: {
    order_code: string
    total_amount: number
    quantity: number
    status: string
    buy_at: string
    expired_at: string
    proxys?: ProxyItem[]
    api_keys?: any[]
    type_servi?: {
      type: string
      name: string
      price: number
      ip_version?: string
    }
  } | null
}

const OrderDetail: React.FC<OrderDetailProps> = ({ open, onClose, order }) => {
  // ----------------- Hooks -----------------
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [dataApiKey, setDataApiKey] = useState()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [, copy] = useCopy()

  // ----------------- Data -----------------
  // Lấy danh sách proxy từ order, nếu không có thì tạo array rỗng
  const dataOrder = order?.api_keys || []

  // ----------------- Columns -----------------
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControlLabel
              sx={{
                '&.MuiFormControlLabel-root': {
                  margin: 0
                }
              }}
              control={
                <Checkbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              }
              label=''
            />
          </div>
        ),
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControlLabel
              sx={{
                '&.MuiFormControlLabel-root': {
                  margin: 0
                }
              }}
              control={
                <Checkbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
              }
              label=''
            />
          </div>
        ),
        size: 60
      },

      {
        accessorKey: 'proxy',
        header: order?.type_servi?.type === '0' ? 'Proxy' : 'Proxy API',
        cell: ({ row }: { row: any }) => {
          if (order?.type_servi?.type === '0') {
            // ----- Dữ liệu Proxy thông thường -----
            const proxys = row.original.proxys || {}

            const proxyValues = Object.entries(proxys)
              .filter(([key]) => key !== 'loaiproxy')
              .map(([_, value]) => value)

            const firstProxy = proxyValues[0] || '-'

            return (
              <div className='flex items-center gap-2'>
                <span className='flex-1 truncate'>{String(firstProxy)}</span>
                {firstProxy !== '-' && (
                  <button
                    className='flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200'
                    onClick={() => copy(String(firstProxy), 'Đã copy proxy!')}
                    title='Copy proxy'
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            )
          } else {
            const apiProxy = row.original?.api_key || '-'

            return (
              <div className='flex items-center gap-2'>
                <span className='flex-1 truncate text-red-600'>{apiProxy}</span>
                {apiProxy !== '-' && (
                  <button
                    className='flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200'
                    onClick={() => copy(apiProxy, 'Đã copy API key!')}
                    title='Copy API key'
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            )
          }
        },
        size: 350
      },
      {
        header: 'Tên',
        cell: ({ row }: { row: any }) => {
          return <span className='text-red'>{order?.type_servi?.name}</span>
        },
        size: 150
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row }: { row: any }) => {
          // const proxys = row.original.proxys || {}
          // const keys = Object.keys(proxys).filter(k => k !== 'loaiproxy')

          // return <b>{keys[0]?.toUpperCase() || '-'}</b>
          return 'HTTP/SOCKS5'
        },
        size: 80
      },
      {
        header: 'Giá tiền',
        cell: ({ row }: { row: any }) => (
          <div>{new Intl.NumberFormat('vi-VN').format(order?.type_servi?.price || 0) + ' đ'}</div>
        ),
        size: 200
      },
      {
        header: 'Ip Version',
        cell: ({ row }: { row: any }) => order?.type_servi?.ip_version,
        size: 200
      },
      {
        accessorKey: 'expired_at',
        header: 'Ngày hết hạn',
        cell: ({ row }: { row: any }) => (
          <div className='flex items-center gap-1'>
            <Clock size={14} />
            <span>{formatDateTimeLocal(row.original.expired_at)}</span>
          </div>
        ),
        size: 200
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <CustomIconButton
                aria-label='capture screenshot'
                color='info'
                variant='tonal'
                onClick={() => {
                  setDataApiKey(row.original.api_key) // lưu dữ liệu dòng hiện tại
                  setIsOpen(true) // mở modal
                }}
              >
                <Eye size={16} />
              </CustomIconButton>
            </>
          )
        },
        size: 100
      }
    ],
    [order, copy]
  )

  // ----------------- Table -----------------
  const table = useReactTable({
    data: dataOrder,
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
    getPaginationRowModel: getPaginationRowModel()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = totalRows ? pageIndex * pageSize + 1 : 0
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  // Function to copy all selected API keys
  const handleCopySelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) return

    let textToCopy = ''

    if (order?.type_servi?.type === '0') {
      // For regular proxies
      selectedRows.forEach((row, index) => {
        const proxys = row.original.proxys || {}

        const proxyValues = Object.entries(proxys)
          .filter(([key]) => key !== 'loaiproxy')
          .map(([_, value]) => value)

        const firstProxy = proxyValues[0]

        if (firstProxy && firstProxy !== '-') {
          textToCopy += firstProxy
          if (index < selectedRows.length - 1) textToCopy += '\n'
        }
      })
    } else {
      // For API keys
      selectedRows.forEach((row, index) => {
        const apiKey = row.original?.api_key

        if (apiKey && apiKey !== '-') {
          textToCopy += apiKey
          if (index < selectedRows.length - 1) textToCopy += '\n'
        }
      })
    }

    if (textToCopy) {
      copy(textToCopy, `Đã copy ${selectedCount} ${order?.type_servi?.type === '0' ? 'proxy' : 'API key'}!`)
    }
  }

  // Function to download selected API keys as .txt file
  const handleDownloadSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) return

    let content = ''
    const itemType = order?.type_servi?.type === '0' ? 'proxy' : 'api_key'

    if (order?.type_servi?.type === '0') {
      // For regular proxies
      selectedRows.forEach((row, index) => {
        const proxys = row.original.proxys || {}

        const proxyValues = Object.entries(proxys)
          .filter(([key]) => key !== 'loaiproxy')
          .map(([_, value]) => value)

        const firstProxy = proxyValues[0]

        if (firstProxy && firstProxy !== '-') {
          content += firstProxy
          if (index < selectedRows.length - 1) content += '\n'
        }
      })
    } else {
      // For API keys
      selectedRows.forEach((row, index) => {
        const apiKey = row.original?.api_key

        if (apiKey && apiKey !== '-') {
          content += apiKey
          if (index < selectedRows.length - 1) content += '\n'
        }
      })
    }

    if (content) {
      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `${order?.order_code || 'order'}_${itemType}s_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Show success message
      copy('', `Đã tải xuống ${selectedCount} key`)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' aria-labelledby='order-detail-dialog'>
        <DialogTitle
          id='customized-dialog-title'
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            position: 'relative',
            alignItems: 'center',
            padding: '8px 16px'
          }}
        >
          {order ? `Chi tiết đơn hàng #${order.order_code}` : 'Không có dữ liệu'}
          <Button
            onClick={onClose}
            disableRipple
            sx={{
              fontSize: '20px'
            }}
          >
            <i className='tabler-x' />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          {order ? (
            <>
              {/* Order Information */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Thông tin đơn hàng
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Mã đơn hàng:
                    </Typography>
                    <Typography variant='body1' fontWeight='bold'>
                      {order.order_code}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: '120px' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Tổng tiền:
                    </Typography>
                    <Typography variant='body1' fontWeight='bold' color='primary'>
                      {new Intl.NumberFormat('vi-VN').format(order.total_amount)} đ
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: '80px' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Số lượng:
                    </Typography>
                    <Typography variant='body1' fontWeight='bold'>
                      {order.quantity}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Trạng thái:
                    </Typography>
                    {getStatusBadge(order.status)}
                  </Box>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Ngày mua:
                    </Typography>
                    <Typography variant='body1'>{formatDateTimeLocal(order.buy_at)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Ngày hết hạn:
                    </Typography>
                    <Typography variant='body1'>{formatDateTimeLocal(order.expired_at)}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Proxy List */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingY: '10px'
                }}
              >
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Danh sách proxy ({totalRows} proxy)
                </Typography>
                {selectedCount > 0 && (
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Typography sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                      Số lượng: {selectedCount}
                    </Typography>
                    <CustomIconButton
                      aria-label='copy selected'
                      size='small'
                      color='success'
                      variant='outlined'
                      sx={{ fontSize: '14px', gap: '5px' }}
                      onClick={handleCopySelected}
                    >
                      <Copy size={16} /> Copy
                    </CustomIconButton>
                    <CustomIconButton
                      aria-label='download selected'
                      size='small'
                      color='warning'
                      variant='outlined'
                      sx={{ fontSize: '14px', gap: '5px' }}
                      onClick={handleDownloadSelected}
                    >
                      <FileDown size={16} /> Download
                    </CustomIconButton>
                  </Box>
                )}
              </Box>

              {dataOrder.length > 0 ? (
                <>
                  <div className='table-wrapper' style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <table className='table-auto w-full border-collapse border border-gray-200 text-sm'>
                      <thead className='sticky top-0 bg-white'>
                        {table.getHeaderGroups().map(headerGroup => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                              <th
                                key={header.id}
                                className='border border-gray-200 px-3 py-2 text-left bg-gray-50 font-semibold'
                                style={{ width: header.column.columnDef.size }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.map(row => (
                          <tr key={row.id} className='hover:bg-gray-50'>
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} className='border border-gray-200 px-3 py-2'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Typography variant='caption' display='block' sx={{ mt: 1, textAlign: 'center' }}>
                    Hiển thị {startRow}-{endRow} / {totalRows} proxy
                  </Typography>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant='body1' color='text.secondary'>
                    Đơn hàng này chưa có proxy nào
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                Không có dữ liệu đơn hàng
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            <Pagination
              count={table.getPageCount()}
              shape='rounded'
              variant='outlined'
              color='primary'
              size={'small'}
              page={table.getState().pagination.pageIndex + 1}
              onChange={(event, page) => {
                table.setPageIndex(page - 1)
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <DetailProxy isOpen={isOpen} handleClose={() => setIsOpen(false)} apiKey={dataApiKey as any} />
    </>
  )
}

export default OrderDetail
