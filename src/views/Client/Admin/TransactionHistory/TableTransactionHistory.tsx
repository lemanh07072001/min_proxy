'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import {
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  List,
  Clock3,
  Search,
  Calendar,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  XCircle,
  FileText,
  RefreshCw,
  Loader2,
  Clock,
  CircleX,
  RotateCcw,
  User
} from 'lucide-react'

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
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

import { toast } from 'react-toastify'

import AppReactDatepicker from '@/components/AppReactDatepicker'

import { formatDateTimeLocal } from '@/utils/formatDate'
import DetailUserModal from '@/views/Client/Admin/TransactionHistory/DetailUserModal'
import LogModal from '@/views/Client/Admin/TransactionHistory/LogModal'
import OrderDetailModal from '@/views/Client/Admin/TransactionHistory/OrderDetailModal'
import { useUserOrders } from '@/hooks/apis/useUserOrders'
import { useOrders, useCancelOrder, useResendOrder, useDeleteOrder, useApiKeys } from '@/hooks/apis/useOrders'
import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS
} from '@/constants'

export default function TableDepositHistory() {
  const isMobile = useMediaQuery('768px')

  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])
  const [isModalDetailUserOpen, setIsModalDetailUserOpen] = useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>()
  const [selectedOrderData, setSelectedOrderData] = useState<any>(null)
  const [orderToCancel, setOrderToCancel] = useState<any>(null)
  const [orderToResend, setOrderToResend] = useState<any>(null)
  const [date, setDate] = useState<Date | null | undefined>(new Date())
  const [searchUser, setSearchUser] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  }) // State để lưu các hàng được chọn

  // TanStack Query mutations
  const { data: dataOrders = [], isLoading } = useOrders()
  const cancelOrderMutation = useCancelOrder()
  const resendOrderMutation = useResendOrder()

  const filteredOrders = useMemo(() => {
    const normalize = (v: any) => (v ?? '').toString().toLowerCase()

    return (dataOrders ?? []).filter((item: any) => {
      // Filter by user name
      const userName = normalize(item?.user?.name)
      const matchesUser = !searchUser || userName.includes(searchUser.trim().toLowerCase())

      // Filter by order status (PENDING/PROCESSING/COMPLETED/FAILED/CANCEL/EXPIRED)
      const orderStatus = (item?.order?.status ?? '').toString()
      const matchesStatus = !statusFilter || orderStatus === statusFilter

      // Filter by date (compare date part only)
      const matchesDate = (() => {
        if (!date) return true
        try {
          const rowDate = new Date(item?.created_at)
          if (isNaN(rowDate.getTime())) return false
          const toYmd = (d: Date) =>
            `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
              .getDate()
              .toString()
              .padStart(2, '0')}`
          return toYmd(rowDate) === toYmd(date as Date)
        } catch {
          return false
        }
      })()

      return matchesUser && matchesStatus && matchesDate
    })
  }, [dataOrders, searchUser, statusFilter, date])

  const { data: sampleUser = [], isLoading: loadingModal, refetch } = useUserOrders(selectedUserId)

  const getTypeBadge = (type: string) => {
    switch (type) {
      case TRANSACTION_TYPES.BUY:
        return (
          <Chip
            label={TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.BUY]}
            size='small'
            icon={<BadgeCheck />}
            color='success'
          />
        )
      case TRANSACTION_TYPES.REFUND:
        return (
          <Chip
            label={TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.REFUND]}
            size='small'
            icon={<BadgeMinus />}
            color='warning'
          />
        )
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]
    const color = ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]

    if (!label) {
      return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }

    // Icon cho từng trạng thái
    let icon = <CircleQuestionMark size={16} />

    switch (status) {
      case ORDER_STATUS.PENDING:
        // Đang chờ xử lý - icon clock
        icon = (
          <Loader2
            size={16}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        )
        break
      case ORDER_STATUS.PROCESSING:
        // Đang xử lý - icon loading xoay
        icon = (
          <Loader2
            size={16}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        )
        break
      case ORDER_STATUS.COMPLETED:
        // Hoàn thành - icon check
        icon = <BadgeCheck size={16} />
        break
      case ORDER_STATUS.FAILED:
        // Lỗi - icon X
        icon = <CircleX size={16} />
        break
      case ORDER_STATUS.CANCEL:
        // Hoàn tiền - icon XCircle
        icon = <XCircle size={16} />
        break
      case ORDER_STATUS.EXPIRED:
        // Hoàn tiền - icon rotate
        icon = <Clock size={16} />
        break

      default:
        icon = <CircleQuestionMark size={16} />
    }

    return <Chip label={label} size='small' icon={icon} color={color as any} />
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: isMobile ? 60 : 20
      },
      {
        header: 'User',
        cell: ({ row }: { row: any }) => (
          <div onClick={() => handleOpenModalUserDetail(row.original?.user?.id)} className='cursor-pointer'>
            <div className='font-bold '>{row.original?.user?.name}</div>
            <div className='text-gray-500'>{row.original?.user?.email}</div>
          </div>
        ),
        size: isMobile ? 250 : 250
      },

      {
        accessorKey: 'type',
        header: 'Loại',
        cell: ({ row }: { row: any }) => {
          return getTypeBadge(row.original.type)
        },
        ssize: isMobile ? 250 : 80
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <div>
            <span className='font-sm font-bold'>
              Giá tiền: {new Intl.NumberFormat('vi-VN').format(row.original.sotienthaydoi) + ' đ'}
            </span>
          </div>
        ),
        size: 150
      },
      {
        header: 'Nội dung',
        size: 250,
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <div>{row.original.noidung}</div>
              </div>
            </>
          )
        }
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày mua',
        size: 200,
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.created_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          if (row.original?.type === 'REFUND') {
            return getStatusBadge(row.original?.order?.status)
          } else {
            return getStatusBadge(row.original?.order?.status)
          }
        },
        ssize: isMobile ? 250 : 100
      },
      {
        header: 'Hành động',
        size: 150,
        cell: ({ row }: { row: any }) => {
          const orderStatus = row.original?.order?.status

          // Nếu status == FAILED, chỉ hiển thị 3 button: Hủy đơn hàng, Xem log, Gửi lại
          if (orderStatus === ORDER_STATUS.FAILED) {
            return (
              <div className='flex gap-2'>
                <Tooltip title='Hủy đơn hàng'>
                  <IconButton size='small' color='error' onClick={() => handleOpenCancelDialog(row.original)}>
                    <XCircle size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xem log'>
                  <IconButton size='small' color='info' onClick={() => handleOpenLogModal(row.original)}>
                    <FileText size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Gửi lại'>
                  <IconButton size='small' color='success' onClick={() => handleOpenResendDialog(row.original)}>
                    <RefreshCw size={18} />
                  </IconButton>
                </Tooltip>
              </div>
            )
          } else if (orderStatus === ORDER_STATUS.CANCEL || orderStatus === ORDER_STATUS.PENDING) {
            return null
          } else {
            // Các status khác hiển thị button mặc định
            return (
              <div className='flex gap-2'>
                <Tooltip title='Xem chi tiết đơn hàng'>
                  <IconButton size='small' color='primary' onClick={() => handleOpenOrderDetailModal(row.original)}>
                    <Eye size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xem thông tin user'>
                  <IconButton
                    size='small'
                    color='info'
                    onClick={() => handleOpenModalUserDetail(row.original?.user?.id)}
                  >
                    <User size={18} />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
        }
      }
    ],
    [isMobile]
  )

  const table = useReactTable({
    data: filteredOrders,
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

  // Detail User Modal

  useEffect(() => {
    if (selectedUserId) {
      refetch()
    }
  }, [selectedUserId])

  const handleOpenModalUserDetail = async (userId: number) => {
    setSelectedUserId(userId)
    setIsModalDetailUserOpen(true)
  }

  const handleOpenLogModal = (orderData: any) => {
    setSelectedOrderData(orderData)
    setIsLogModalOpen(true)
  }

  const handleOpenOrderDetailModal = (orderData: any) => {
    setSelectedOrderData(orderData)
    setIsOrderDetailModalOpen(true)
  }

  const handleCloseOrderDetailModal = () => {
    setIsOrderDetailModalOpen(false)
    setSelectedOrderData(null)
  }

  const handleOpenCancelDialog = (orderData: any) => {
    setOrderToCancel(orderData)
    setIsCancelDialogOpen(true)
  }

  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false)
    setOrderToCancel(null)
  }

  const handleConfirmCancel = () => {
    if (!orderToCancel?.order?.id) return

    cancelOrderMutation.mutate(orderToCancel?.order?.id, {
      onSuccess: () => {
        handleCloseCancelDialog()
        toast.success('Hủy đơn hàng thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng')
        console.error('Lỗi khi hủy đơn hàng:', error)
      }
    })
  }

  const handleOpenResendDialog = (orderData: any) => {
    setOrderToResend(orderData)
    setIsResendDialogOpen(true)
  }

  const handleCloseResendDialog = () => {
    setIsResendDialogOpen(false)
    setOrderToResend(null)
  }

  const handleConfirmResend = () => {
    if (!orderToResend?.order?.id) return

    resendOrderMutation.mutate(orderToResend?.order?.id, {
      onSuccess: () => {
        handleCloseResendDialog()
        toast.success('Gửi lại đơn hàng thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi lại đơn hàng')
        console.error('Lỗi khi gửi lại đơn hàng:', error)
      }
    })
  }

  return (
    <>
      <div className='orders-content'>
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar w-full'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <div className='flex justify-between align-middle'>
                <h5 className='mb-0 font-semibold'>Lịch sử giao dịch</h5>
              </div>
            </div>

            <div className='header-right'>
              <div className='flex align-middle gap-2'>
                <CustomTextField
                  fullWidth
                  className='lg:w-[320px]'
                  size='small'
                  placeholder='Nhập user...'
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search size={16} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        {searchUser ? (
                          <IconButton aria-label='clear' size='small' onClick={() => setSearchUser('')}>
                            <X size={16} />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    )
                  }}
                />

                <CustomTextField
                  fullWidth
                  select
                  value={statusFilter}
                  className='lg:w-[220px]'
                  id='select-without-label'
                  slotProps={{
                    select: { displayEmpty: true },
                    htmlInput: { 'aria-label': 'Without label' }
                  }}
                  onChange={e => setStatusFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Filter size={16} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        {statusFilter ? (
                          <IconButton aria-label='clear' size='small' onClick={() => setStatusFilter('')}>
                            <X size={16} />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    )
                  }}
                >
                  <MenuItem value=''>
                    <em>Chọn trạng thái</em>
                  </MenuItem>
                  <MenuItem value={ORDER_STATUS.PENDING}>Đang chờ xử lý</MenuItem>
                  <MenuItem value={ORDER_STATUS.PROCESSING}>Đang xử lý</MenuItem>
                  <MenuItem value={ORDER_STATUS.COMPLETED}>Hoàn thành</MenuItem>
                  <MenuItem value={ORDER_STATUS.FAILED}>Thất bại</MenuItem>
                  <MenuItem value={ORDER_STATUS.CANCEL}>Hoàn tiền</MenuItem>
                  <MenuItem value={ORDER_STATUS.EXPIRED}>Hết hạn</MenuItem>
                </CustomTextField>

                <AppReactDatepicker
                  className='lg:w-[180px]'
                  selected={date}
                  id='basic-input'
                  onChange={(date: Date | null) => setDate(date)}
                  placeholderText='Chọn ngày'
                  customInput={
                    <CustomTextField
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Calendar size={16} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            {date ? (
                              <IconButton aria-label='clear' size='small' onClick={() => setDate(null)}>
                                <X size={16} />
                              </IconButton>
                            ) : null}
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                />
              </div>
            </div>
          </div>
          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || dataOrders.length === 0 ? { height: '100%' } : {}}>
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

      <DetailUserModal
        isOpen={isModalDetailUserOpen}
        onClose={() => setIsModalDetailUserOpen(false)}
        data={sampleUser}
        isLoading={loadingModal}
      />

      <LogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        data={selectedOrderData}
        isLoading={false}
      />

      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={handleCloseOrderDetailModal}
        orderData={selectedOrderData}
        isLoading={false}
      />

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        aria-labelledby='cancel-dialog-title'
        aria-describedby='cancel-dialog-description'
      >
        <DialogTitle id='cancel-dialog-title'>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText id='cancel-dialog-description'>
            Bạn có chắc chắn muốn hủy đơn hàng <strong>#{orderToCancel?.order?.order_code}</strong> không?
            <br />
            Đơn hàng sẽ được chuyển sang trạng thái "Đã hủy" và tiền sẽ được hoàn lại.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color='inherit'>
            Quay lại
          </Button>
          <Button onClick={handleConfirmCancel} color='error' variant='contained' autoFocus>
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resend Order Confirmation Dialog */}
      <Dialog
        open={isResendDialogOpen}
        onClose={handleCloseResendDialog}
        aria-labelledby='resend-dialog-title'
        aria-describedby='resend-dialog-description'
      >
        <DialogTitle id='resend-dialog-title'>Xác nhận gửi lại đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText id='resend-dialog-description'>
            Bạn có chắc chắn muốn gửi lại đơn hàng <strong>#{orderToResend?.order?.order_code}</strong> không?
            <br />
            Hệ thống sẽ thực hiện lại quá trình xử lý đơn hàng này.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResendDialog} color='inherit'>
            Hủy
          </Button>
          <Button onClick={handleConfirmResend} color='success' variant='contained' autoFocus>
            Xác nhận gửi lại
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
