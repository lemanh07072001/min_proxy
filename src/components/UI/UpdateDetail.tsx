import { Box, Typography } from '@mui/material'

import { List } from 'lucide-react'

import BoxCustom from './BoxCustom'

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
      <div className='pt-4'>
        {updateHistory.map((update, index) => (
          <div key={index} className='flex space-x-3'>
            <div className={`w-3 h-3 ${update.color} rounded-full mt-1 flex-shrink-0`}></div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-600 mb-2'>{update.date}</p>
              {update.updates.length > 0 && (
                <ul className='p-0'>
                  {update.updates.map((item, itemIndex) => (
                    <li key={itemIndex} className='text-sm text-gray-700 flex items-start'>
                      <span className='w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0'></span>
                      {item}
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
