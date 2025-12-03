'use client'

import { useMemo, useState } from 'react'

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Clock3, Copy } from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCodeTransactions } from '@/hooks/apis/useCodeTransactions'
import CustomIconButton from '@core/components/mui/IconButton'
import { useCopy } from '@/app/hooks/useCopy'

export default function CodeTransactionsTable() {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data: codeTransactions, isLoading } = useCodeTransactions()
  const [, copy] = useCopy()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã giao dịch',
        cell: ({ row }) => {
          const code = row.original.code

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{code}</Typography>
              <CustomIconButton
                aria-label='copy code'
                color='primary'
                size='small'
                onClick={() => copy(code)}
              >
                <Copy size={14} />
              </CustomIconButton>
            </Box>
          )
        },
        size: 200
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày tạo',
        cell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock3 size={14} />
              <Typography sx={{ fontSize: '14px' }}>
                {row.original.created_at ? formatDateTimeLocal(row.original.created_at) : 'N/A'}
              </Typography>
            </Box>
          )
        },
        size: 150
      },
      {
        accessorKey: 'updated_at',
        header: 'Cập nhật',
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: '14px' }}>
              {row.original.updated_at ? formatDateTimeLocal(row.original.updated_at) : 'N/A'}
            </Typography>
          )
        },
        size: 150
      }
    ],
    [copy]
  )

  const table = useReactTable({
    data: codeTransactions ?? [],
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)
  const pageCount = table.getPageCount()

  if (isLoading) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #e0e0e0'
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          userSelect: 'none'
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' ↑',
                          desc: ' ↓'
                        }[header.column.getIsSorted() as string] ?? null}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', padding: 4 }}>
                  <Typography sx={{ color: 'text.secondary' }}>Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} sx={{ padding: '12px 16px' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pageCount > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 2,
            padding: 2
          }}
        >
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
            Hiển thị {startRow} - {endRow} trong tổng số {totalRows} bản ghi
          </Typography>
          <Pagination
            count={pageCount}
            page={pageIndex + 1}
            onChange={(_, page) => table.setPageIndex(page - 1)}
            color='primary'
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  )
}



