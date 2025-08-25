'use client'

import { useMemo, useState } from 'react'

import { headers } from 'next/headers'

import { toast } from 'react-toastify'

import {
  TriangleAlert,
  Copy,
  RotateCcwKey,
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  Calendar,
  Key
} from 'lucide-react'

import Button from '@mui/material/Button'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import './styles.css'
import Pagination from '@mui/material/Pagination'

import CustomIconButton from '@core/components/mui/IconButton'

export default function OrderProxyPage({ data }) {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn

  const dataOrder = useMemo(() => data, [data])

  const togglePasswordVisibility = (proxyId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [proxyId]: !prev[proxyId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'viettel':
        return 'text-red-600 bg-red-50'
      case 'fpt':
        return 'text-orange-600 bg-orange-50'
      case 'vnpt':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label='Đang hoạt động' size='small' icon={<BadgeCheck />} color='success' />
      case 'expired':
        return <Chip label='Hết hạn' size='small' icon={<TriangleAlert />} color='error' />
      case 'suspended':
        return <Chip label='Tạm dừng' size='small' icon={<BadgeMinus />} color='warning' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const totalPages = Math.ceil(dataOrder.length / pageSize)

  const columns = useMemo(
    () => [
      {
        id: 'select', // ID của cột checkbox
        header: ({ table }) => (
          <input
            type='checkbox'
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type='checkbox'
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'provider',
        header: 'Nhà mạng',
        cell: ({ row }) => {
          return <span className='text-red'>viettel</span>
        }
      },
      {
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row }) => {
          console.log(row)

          return (
            <div className='proxy-cell'>
              <span className='proxy-label'>{row.original.proxy}</span>
              <button className='icon-button'>
                <Copy size={14} />
              </button>
            </div>
          )
        }
      },
      {
        accessorKey: 'ip',
        header: 'Ip cũ'
      },
      {
        accessorKey: 'protocol',
        header: 'Loại'
      },
      {
        accessorKey: 'note',
        header: 'Note'
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn'
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          return getStatusBadge(row.original.status)
        }
      },
      {
        accessorKey: 'remainingDays',
        header: 'Ngày'
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true, // Bật tính năng chọn hàng
    onRowSelectionChange: setRowSelection, // Cập nhật state khi có thay đổi
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel() // Tùy chọn: cần thiết nếu có bộ lọc
  })

  return (
    <>
      <div className='orders-content'>
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar'>
            {/* Đổi password */}
            <Button variant='outlined' startIcon={<RotateCcwKey size={16} />}>
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

          <div className='table-container'>
            {/* Table */}
            <div className='table-wrapper'>
              <table className='data-table'>
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
                  {table.getRowModel().rows.map(row => (
                    <tr className='table-row' key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td className='table-cell' key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
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
                      <select className='page-size-select'>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                        <option value='200'>200</option>
                      </select>
                      <div className='select-arrow'>
                        <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className='text-sm text-gray'>1 - 1 của 1 dòng hàng</span>
                </div>

                <div className='pagination-buttons'>
                  <Pagination count={3} shape='rounded' variant='outlined' color='primary' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
