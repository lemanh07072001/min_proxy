'use client'

import { useMemo, useState } from 'react'

import { TriangleAlert, CircleQuestionMark, BadgeCheck, BadgeMinus } from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import Pagination from '@mui/material/Pagination'

import MenuItem from '@mui/material/MenuItem'

import CustomTextField from '@core/components/mui/TextField'



export default function TransactionHistoryPage({data} : any) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [searchTerm, setSearchTerm] = useState(''); // State cho ô input tìm kiếm
  const [filterCategory, setFilterCategory] = useState('a'); // State cho ô select danh mục

  const dataOrder = useMemo(() => data, [data])


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label='Hoàn thành' size='small' icon={<BadgeCheck />} color='success' />
      case 'expired':
        return <Chip label='Hết hạn' size='small' icon={<TriangleAlert />} color='error' />
      case 'suspended':
        return <Chip label='Chờ giao dịch' size='small' icon={<BadgeMinus />} color='warning' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [

      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        header: 'Lịch sử giao dịch',
        cell: ({ row }) => {
          if(row.original.type === 'spend'){
            return (
              (
                <div>
                  <Chip label='Tiêu' size='small' color='primary' style={{color:"#fff"}}/>
                  <span className='font-sm ms-2'>{row.original.description} VND</span>
                </div>
              )
            )
          }else if(row.original.type === 'wallet'){
            return (
              (
                <div>
                  <Chip label='Nạp' size='small' color='success' />
                  <span className='font-sm ms-2'>{row.original.description} VND</span>
                </div>
              )
            )
          }
        }
      },
      {
        accessorKey: 'amount',
        header: 'Số tiền',
        cell: ({ row }) => {
          // Tạo một formatter cho tiền tệ Việt Nam
          const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          });

          const amount = row.original.amount;

          return (
            <div>
              {/* Định dạng số tiền ở đây */}
              <div className='font-bold'>{formatter.format(amount)}</div>

              {/* Dòng phụ này có thể không cần thiết nữa vì dòng trên đã có "₫" */}
              <span className='text-sm text-gray-500'>Số tiền gốc: {amount}</span>
            </div>
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
        accessorKey: 'date',
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
      <div className='table-container'>
        <div className='orders-content'>
        {/* Toolbar */}
        <div className='table-toolbar'>
          {/* Search */}
          <CustomTextField placeholder='Search' />

          {/* Select */}
          <CustomTextField
            select
            fullWidth
            style={{ width: '200px' }}
          >
            <MenuItem value=''>

              <em>Chọn trạng thái</em>
            </MenuItem>
            <MenuItem value="pending">Đang chờ xử lý</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="canceled">Đã huỷ</MenuItem>
          </CustomTextField>
        </div>
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
    </>
  )
}