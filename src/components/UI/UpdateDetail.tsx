import { Box, Typography } from '@mui/material'

import { List } from 'lucide-react'

import BoxCustom from './BoxCustom'

// Hàm trợ giúp để xử lý định dạng **text** thành chữ viết hoa
const processUpdateText = text => {
  // Biểu thức chính quy: tìm bất kỳ văn bản nào nằm giữa hai dấu **
  const regex = /(\*\*[^*]+\*\*|[^**]+)/g
  const parts = text.match(regex) || [text]

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Loại bỏ ** và chuyển thành chữ hoa
      const boldText = part.substring(2, part.length - 2)

      return (
        <strong key={index} className='uppercase'>
          {boldText}
        </strong>
      )
    }

    // Trả về văn bản thường
    return <span key={index}>{part}</span>
  })
}

export default function UpdateDetail({ updateHistory }) {
  return (
    <BoxCustom>
      <div className='header-left'>
        <div className='page-icon'>
          <List size={17} />
        </div>
        <div>
          <h5 className='mb-0 font-semibold'>Chi tiết cập nhật</h5>
        </div>
      </div>
      <div className='pt-4 space-y-6'>
        {' '}
        {/* Thêm khoảng cách giữa các bản cập nhật */}
        {updateHistory.map((update, index) => (
          // Thẻ div bao bọc mỗi mục cập nhật lớn
          <div key={index} className='flex space-x-3'>
            <div className={`w-3 h-3 ${update.color} rounded-full mt-1 flex-shrink-0`}></div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-600 mb-2'>{update.date}</p>
              {update.updates.length > 0 && (
                <ul className='p-0 list-none space-y-1'>
                  {' '}
                  {/* list-none và space-y-1 để tùy chỉnh */}
                  {update.updates.map((item, itemIndex) => (
                    <li key={itemIndex} className='text-sm text-gray-700 flex items-start'>
                      {/* Thay đổi: Biểu tượng dấu đầu dòng tùy chỉnh */}
                      <span className='w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0'></span>

                      {/* Sử dụng hàm xử lý văn bản */}
                      {processUpdateText(item)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </BoxCustom>
  )
}
