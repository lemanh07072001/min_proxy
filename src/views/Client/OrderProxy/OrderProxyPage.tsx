'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  TriangleAlert,
  Copy,
  RotateCcwKey,
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  Calendar,
  Key,
  Clock,
  Clock3,
  List
} from 'lucide-react'

import Button from '@mui/material/Button'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import './styles.css'
import Pagination from '@mui/material/Pagination'

import Checkbox from '@mui/material/Checkbox'

import { FormControlLabel } from '@mui/material'

import CustomIconButton from '@core/components/mui/IconButton'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'

import { ChangePassword } from './ChangePassword'

import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'


export default function OrderProxyPage() {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([])
  const [changePassword, setChangePassword] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const axiosAuth = useAxiosAuth()
  const [, copy] = useCopy()

  const {
    data: dataOrders = [],
    isLoading,
  } = useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order-proxy-static')
      return res.data.data
    }
  })


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label='Đang hoạt động' size='small' icon={<BadgeCheck />} color='success' />
      case 'INACTIVE':
        return <Chip label='Hết hạn' size='small' icon={<TriangleAlert />} color='error' />
      case 'suspended':
        return <Chip label='Tạm dừng' size='small' icon={<BadgeMinus />} color='warning' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              }
              label='' // bỏ label để không chiếm chỗ
            />
          </div>
        ),
        cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControlLabel
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
        size: 40
      },
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'provider',
        header: 'Nhà mạng',
        cell: ({ row }) => {
          const proxys = row.original.proxys || {} // fallback nếu null
          const loaiproxy = proxys.loaiproxy || '-' // fallback nếu không tồn tại

          return <span className='text-red'>{loaiproxy}</span>
        }
      },
      {
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row }) => {
          const proxys = row.original.proxys || {}

          const proxyValues = Object.entries(proxys)
            .filter(([key]) => key !== 'loaiproxy')
            .map(([_, value]) => value)

          return (
            <div className='proxy-cell'>
              <span className='proxy-label'>{proxyValues[0] || '-'}</span>
              {proxyValues[0] && (
                <button className='icon-button' onClick={() => copy(proxyValues[0])}>
                  <Copy size={14} />
                </button>
              )}
            </div>
          )
        }
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row }) => {
          const proxys = row.original.proxys || {} // nếu null hoặc undefined, fallback thành {}
          const keys = Object.keys(proxys)

          return <div className='font-bold'>{keys[0]?.toUpperCase() || '-'}</div>
        }
      },
      {
        accessorKey: 'buyDate',
        header: 'Ngày mua',
        cell: ({ row }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.buy_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        cell: ({ row }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.expired_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          return getStatusBadge(row.original.status)
        }
      },
      {
        header: 'Action'
      }
    ],
    []
  )

  const table = useReactTable({
    data: dataOrders,
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

  const handleChangePassword = () => {
    setChangePassword(true)
  }

  const handleCloseChangePassword = () => {
    setChangePassword(false)
  }

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
              <div>
                <h5 className='mb-0 font-semibold'>Danh sách proxy</h5>
              </div>
            </div>
            <div className='d-flex gap-2'>
              {/* Đổi password */}
              <Button onClick={handleChangePassword} variant='outlined' startIcon={<RotateCcwKey size={16} />}>
                Đổi password
              </Button>

              {/* Gia hạn */}
              <Button variant='outlined' startIcon={<Calendar size={16} />}>
                Gia hạn
              </Button>

              {/* Đổi bảo mật */}
              <Button variant='outlined' startIcon={<Key size={16} />}>
                Đổi bảo mật
              </Button>

              {/* Đổi proxy */}
              <Button variant='contained' color='error' disabled>
                Đổi proxy
              </Button>

              {/* Copy all */}
              <CustomIconButton aria-label='capture screenshot' variant='outlined'>
                <Copy size={16} />
              </CustomIconButton>
            </div>
          </div>

          <div className='table-container'>
            {/* Table */}
            <div className='table-wrapper'>
              <table className='data-table'  style={isLoading || dataOrders.length === 0 ? { height: '100%' } : {}}>
                <thead className='table-header'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th className='table-header th' key={header.id}>
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
      </div>

      {/* Modal Change Password Proxy */}
      <ChangePassword open={changePassword} onClose={handleCloseChangePassword} />
    </>
  )
}
