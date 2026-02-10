'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material'
import { Calendar } from 'lucide-react'

// Cấu hình các tùy chọn số ngày - dễ dàng mở rộng
export interface DayRangeOption {
  label: string
  days: number
  value: string
}

// Cấu hình mặc định - có thể mở rộng dễ dàng
export const DEFAULT_DAY_RANGE_OPTIONS: DayRangeOption[] = [
  { label: '1 ngày', days: 1, value: '1' },
  { label: '3 ngày', days: 3, value: '3' },
  { label: '7 ngày (1 tuần)', days: 7, value: '7' },
  { label: '14 ngày (2 tuần)', days: 14, value: '14' },
  { label: '21 ngày (3 tuần)', days: 21, value: '21' },
  { label: '30 ngày (1 tháng)', days: 30, value: '30' }
]

interface DayRangeSelectorModalProps {
  open: boolean
  onClose: () => void
  onSelect: (option: DayRangeOption) => void
  selectedOption?: DayRangeOption
  options?: DayRangeOption[] // Cho phép tùy chỉnh options
  title?: string
}

export default function DayRangeSelectorModal({
  open,
  onClose,
  onSelect,
  selectedOption,
  options = DEFAULT_DAY_RANGE_OPTIONS,
  title = 'Chọn số ngày'
}: DayRangeSelectorModalProps) {
  const handleSelect = (option: DayRangeOption) => {
    onSelect(option)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <div className='flex items-center gap-2'>
          <Calendar size={20} className='text-[#f97316]' />
          <span>{title}</span>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List>
          {options.map((option, index) => (
            <div key={option.value}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedOption?.value === option.value}
                  onClick={() => handleSelect(option)}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(249, 115, 22, 0.15)'
                      }
                    }
                  }}
                >
                  <ListItemText
                    primary={option.label}
                    secondary={option.days > 1 ? `Tổng hợp dữ liệu từ ${option.days} ngày` : 'Dữ liệu 1 ngày'}
                  />
                </ListItemButton>
              </ListItem>
              {index < options.length - 1 && <Divider component='li' />}
            </div>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )
}
