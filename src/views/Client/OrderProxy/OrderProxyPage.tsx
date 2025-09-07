'use client'

import { useMemo, useState } from 'react'

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
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide
} from 'lucide-react'

import Button from '@mui/material/Button'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel, getPaginationRowModel, getFacetedRowModel, getFacetedUniqueValues, getSortedRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import './styles.css'
import Pagination from '@mui/material/Pagination'

import CustomIconButton from '@core/components/mui/IconButton'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'



export default function OrderProxyPage({ data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [, copy] = useCopy();

  const dataOrder = useMemo(() => data || [], [data])

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
          const proxys = row.original.proxys || {}; // fallback nếu null
          const loaiproxy = proxys.loaiproxy || '-'; // fallback nếu không tồn tại
          return <span className='text-red'>{loaiproxy}</span>
        }
      },
      {
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row }) => {
          const proxys = row.original.proxys || {};
          const proxyValues = Object.entries(proxys)
            .filter(([key]) => key !== 'loaiproxy')
            .map(([_, value]) => value);

          return (
            <div className='proxy-cell'>
              <span className='proxy-label'>{proxyValues[0] || '-'}</span>
              {proxyValues[0] && (
                <button className='icon-button' onClick={()=>copy(proxyValues[0])}>
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
          const proxys = row.original.proxys || {}; // nếu null hoặc undefined, fallback thành {}
          const keys = Object.keys(proxys);

          return <div className="font-bold">{keys[0]?.toUpperCase() || '-'}</div>;
        }
      },
      {
        accessorKey: 'buyDate',
        header: 'Ngày mua',
        cell: ({ row }) => {
          return (
            <>
              <div className="d-flex align-items-center  gap-1 ">
                <Clock3  size={14} />
                <div style={{marginTop:'2px'}}>{formatDateTimeLocal(row.original.buy_at)}</div>
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
              <div className="d-flex align-items-center  gap-1 ">
                <Clock size={14} />
                <div style={{marginTop:'2px'}}>{formatDateTimeLocal(row.original.expired_at)}</div>
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
    data: dataOrder,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting,
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);


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
                        <th className='table-header th' style={{cursor:'pointer'}} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {
                            header.column.getCanSort() ? (
                              header.column.getIsSorted() === 'asc' ? <ArrowUpNarrowWide className="ms-1" size={14}/> :
                                header.column.getIsSorted() === 'desc' ? <ArrowDownWideNarrow className="ms-1" size={14}/> :
                                  <ArrowDownUp size={14} className="ms-1"/>// Icon mặc định
                            ) : null
                          }
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
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                          table.setPageSize(Number(e.target.value));
                        }}
                        className='page-size-select'>
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
                  <Pagination count={table.getPageCount()}
                              shape='rounded'
                              variant='outlined'
                              color='primary'
                              page={table.getState().pagination.pageIndex + 1}
                              onChange={(event, page) => {
                                table.setPageIndex(page - 1);
                              }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
