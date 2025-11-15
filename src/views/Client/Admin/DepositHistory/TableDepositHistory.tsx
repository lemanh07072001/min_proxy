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
  Loader
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
import Tooltip from '@mui/material/Tooltip'

import Pagination from '@mui/material/Pagination'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import AppReactDatepicker from '@/components/AppReactDatepicker'

import { formatDateTimeLocal } from '@/utils/formatDate'
import DetailUserModal from '@/views/Client/Admin/TransactionHistory/DetailUserModal'
import { useUserOrders } from '@/hooks/apis/useUserOrders'
import { useOrders } from '@/hooks/apis/useOrders'
import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import { useDepositHistory } from '@/hooks/apis/useDeponsitHistory'

export default function TableDepositHistory() {
  const isMobile = useMediaQuery('768px')

  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])
  const [isModalDetailUserOpen, setIsModalDetailUserOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>()
  const [date, setDate] = useState<Date | null | undefined>(new Date())
  const [searchUser, setSearchUser] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 13
  }) // State để lưu các hàng được chọn

  const { data: dataDeposit = [], isLoading: loadingModal, refetch } = useDepositHistory()

  const getTypeBadge = (status: string) => {
    switch (status) {
      // case '':
      //   return <Chip label='Chờ xử lý' size='small' icon={<BadgeAlert />} color='warning' />
      case 'PLUS':
        return <Chip label='Nạp tiền' size='small' icon={<BadgeCheck />} color='success' />
      case 'MINUS':
        return <Chip label='Hoàn' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const getStatusBadge = (status: string, note?: string) => {
    switch (status) {
      // case '':
      //   return <Chip label='Chờ xử lý' size='small' icon={<BadgeAlert />} color='warning' />
      case 'pending': {
        const label = 'Chờ xử lý'
        return <Chip label={label} size='small' icon={<Loader className='animate-spin' />} color='warning' />
      }
      case 'success': {
        const label = 'Thành công'
        return <Chip label={label} size='small' icon={<BadgeCheck />} color='success' />
      }
      case 'failed': {
        const label = 'Thất bại'
        return (
          <Tooltip title={note} placement='top'>
            <Chip label={label} size='small' icon={<BadgeMinus />} color='error' />
          </Tooltip>
        )
      }
      default: {
        const label = 'Thành công'
        return <Chip label={label} size='small' icon={<BadgeCheck />} color='success' />
      }
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: isMobile ? 60 : 20
      },

      {
        accessorKey: 'transaction_type',
        header: 'Loại',
        cell: ({ row }: { row: any }) => {
          return getTypeBadge(row.original.transaction_type)
        },
        size: isMobile ? 150 : 100
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <div>
            <span className='font-sm'>
              Số tiền: {new Intl.NumberFormat('vi-VN').format(row.original.amount) + ' đ'}
            </span>
          </div>
        ),
        size: 120
      },
      {
        header: 'Nội dung',
        size: isMobile ? 650 : 550,
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex flex-col  gap-1 '>
                <div>Mã giao dịch: {row.original.tid}</div>
                <div>Nội dung: {row.original.description}</div>
              </div>
            </>
          )
        }
      },
      {
        header: 'Trạng thái',
        size: isMobile ? 150 : 150,
        cell: ({ row }: { row: any }) => {
          return getStatusBadge(row.original.status, row.original.note)
        }
      },
      {
        accessorKey: 'created_at',
        header: 'Thời gian',
        size: isMobile ? 220 : 150,
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
      }
    ],
    []
  )

  // Lọc dữ liệu: tìm kiếm theo id, amount, description; lọc status; so sánh theo ngày created_at
  const filteredDeposit = useMemo(() => {
    const normalize = (v: any) => (v ?? '').toString().toLowerCase()

    return (dataDeposit ?? []).filter((item: any) => {
      // Search text
      const q = normalize(searchUser).trim()
      const idStr = normalize(item?.id)
      const amountStr = normalize(item?.amount)
      const descriptionStr = normalize(item?.description)
      const matchesSearch = !q || idStr.includes(q) || amountStr.includes(q) || descriptionStr.includes(q)

      // Status filter (treat null/undefined as 'success')
      const effectiveStatus = (item?.status ?? 'success').toString()
      const matchesStatus = !statusFilter || effectiveStatus === statusFilter

      // Date filter (date-only)
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

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [dataDeposit, searchUser, statusFilter, date])

  const table = useReactTable({
    data: filteredDeposit,
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
                  placeholder='Nhập từ khóa...'
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
                  <MenuItem value={'pending'}>Chờ xử lý</MenuItem>
                  <MenuItem value={'success'}>Thành công</MenuItem>
                  <MenuItem value={'failed'}>Thất bại</MenuItem>
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
            <table className='data-table' style={loadingModal || dataDeposit.length === 0 ? { height: '100%' } : {}}>
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
                {loadingModal ? (
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
                    <tr
                      className={`table-row ${
                        row.original?.type === 'gem1' || row.original?.transaction_type === 'gem1' ? 'text-red-500' : ''
                      }`}
                      key={row.id}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          className={`table-cell ${
                            row.original?.type === 'gem1' || row.original?.transaction_type === 'gem1'
                              ? 'text-red-500'
                              : ''
                          }`}
                          key={cell.id}
                        >
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

      {/* <DetailUserModal
        isOpen={isModalDetailUserOpen}
        onClose={() => setIsModalDetailUserOpen(false)}
        // data={dataDeposit}
        isLoading={loadingModal}
      /> */}
    </>
  )
}
