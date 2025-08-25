"use client"

import './styles.css'
import { useMemo, useState } from 'react'

import { BadgeCheck, CheckCircle, Copy, Download, Loader, RefreshCw, BadgeMinus, BadgeAlert, AlertTriangle } from 'lucide-react'

import Chip from '@mui/material/Chip'

import Pagination from '@mui/material/Pagination'


import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'

interface ProxyData {
  proxy: string;
  ip: string;
  protocol: string;
  status: string;
  responseTime: string;
  type: string
}

interface CheckProxyTableProps {
  data: ProxyData;
  checkedProxy: any
}

export default function CheckProxyTable({ data, checkedProxy } : CheckProxyTableProps) {
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn

  console.log(checkedProxy)

  const columns = useMemo(
    () => [
      {
        id: 'select', // ID của cột checkbox
        header: ({ table } : any) => (
          <input
            type='checkbox'
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: any) => (
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
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row } :any) => {
          return (
            <>
              <div className='proxy-text'>{row.original.proxy}</div>
              <button className='copy-icon-btn'>
                <Copy size={14} />
              </button>
            </>
          )
        }
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row } :any) => {
          if(row.original.protocol === 'http') {
            return (
              <span>HTTP</span>
            )
          }else if(row.original.protocol === 'socks5') {
            return (
              <span>SOCKS5</span>
            )
          }
        }
      },
      {
        accessorKey: 'responseTime',
        header: 'Ping',
        cell: ({ row }) => {
          const ping = row.original.responseTime;

          console.log(ping)

          if (ping === 'checking') {
            return (
              <Chip
                label='Đang chờ'
                color='secondary'
                variant='tonal'
                size='small'
                icon={<Loader size={16} className="spinning-icon" />}
              />
            );
          }
          if (typeof ping !== 'number' || ping <= 0) {
            return (
              <Chip
                label='Lỗi'
                color='error'
                variant='tonal'
                size='small'
                icon={<BadgeAlert size={16} />}
              />
            );
          }
          if (ping < 300) {
            return (
              <Chip
                label={`${ping} ms`}
                color='success'
                variant='tonal'
                size='small'
                icon={<BadgeCheck size={16} />}
              />
            );
          }
          if (ping < 800) {
            return (
              <Chip
                label={`${ping} ms`}
                color='warning'
                variant='tonal'
                size='small'
                icon={<AlertTriangle size={16} />}
              />
            );
          }
          return (
            <Chip
              label={`${ping} ms`}
              color='error'
              variant='tonal'
              size='small'
              icon={<BadgeMinus size={16} />}
            />
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row } :any) => {
          if(row.original.status === 'checking') {
            return (
              <Chip label='Đang chờ xử lý' color='secondary' variant='tonal' size='small' icon={<Loader size={16} className="spinning-icon"/>} />
            )
          }else if(row.original.status === 'success') {
            return (
              <Chip label='Đang hoạt động' color='success' variant='tonal' size='small' icon={<BadgeCheck  size={16} />} />
            )
          }else{
            return (
              <Chip label='Ngưng hoạt động' color='error' variant='tonal' size='small' icon={<BadgeMinus size={16}/>} />
            )
          }
        }
      },

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
      <div className='results-panel'>
        <div className='results-card'>
          <div className='results-header'>
            <div className='results-title'>
              <CheckCircle size={20} className='text-green-500' />
              <span>Kết quả kiểm tra Proxy (1)</span>
            </div>
            <div className='results-actions'>
              <button className='action-btn-check'>
                <Download size={16} />
                Export
              </button>
              <button className='action-btn-check'>
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className='table-container'>
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
      </div>
    </>
  )
}
