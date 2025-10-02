'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import {
  TriangleAlert,
  Copy,
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  Download,
  Clock3,
  Clock,
  List,
  RefreshCcw,
  Loader
} from 'lucide-react'

import Button from '@mui/material/Button'

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

import { FormControlLabel } from '@mui/material'

import Checkbox from '@mui/material/Checkbox'

import { useQuery } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import useAxiosAuth from '@/hocs/useAxiosAuth'

import CustomIconButton from '@core/components/mui/IconButton'

import { formatDateTimeLocal } from '@/utils/formatDate'

export default function AdminPartnerPage() {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([])
  const axiosAuth = useAxiosAuth()

  const {
    data: dataPartner,
    error,
    isLoading
  } = useQuery({
    queryKey: ['partner'],
    queryFn: async () => {
      const res = await axiosAuth.get(`/get-partner`)

      console.log(res)

      return res.data.data
    }
  })

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label='Đang hoạt động' size='small' icon={<BadgeCheck />} color='success' />
      case 'EXPRIRED':
        return <Chip label='Hết hạn' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(() => [
    {
      id: 'select',
      size: 20,
      header: ({ table }) => (
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
            label='' // bỏ label để không chiếm chỗ
          />
        </div>
      ),
      cell: ({ row }) => (
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
      accessorKey: 'id',
      header: 'ID',
      size: 60
    },
    {
      accessorKey: 'api_key',
      header: 'Api key',
      cell: ({ row }) => {
        const api_key = row.original.api_key || '-'

        return <span className='text-red'>{api_key}</span>
      },
      size: 300
    },
    {
      accessorKey: 'protocol',
      header: 'Loại',
      cell: ({ row }) => {
        const keys = row.original.plan_type || '-'

        return <div className='font-bold'>{keys}</div>
      },
      size: 100
    },
    {
      header: 'Ip Version',
      cell: ({ row }) => {
        const ip_version = row.original.type_service?.ip_version ?? '-'

        return <div className='font-bold'>{ip_version}</div>
      },
      size: 100
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
      },
      size: 200
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
      },
      size: 200
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        return getStatusBadge(row.original.status)
      },
      size: 150
    },
    {
      header: 'Action',
      cell: ({ row }) => {
        const isRowLoading = loadingId === row.original.api_key

        if (row.original.status === 'ACTIVE') {
          return (
            <CustomIconButton
              aria-label='capture screenshot'
              color='info'
              variant='tonal'
              disabled={isRowLoading}
              onClick={() => handleOpenModal(row.original?.api_key)}
            >
              {isRowLoading ? <Loader size={16} /> : <RefreshCcw size={16} />}
            </CustomIconButton>
          )
        }
      },
      size: 120
    }
  ])

  const table = useReactTable({
    data: dataPartner ?? [],
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
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Danh sách đối tác</h1>
        <p className='text-gray-600'>Welcome back! Here's what's happening with your platform today.</p>
      </div>
    </>
  )
}
