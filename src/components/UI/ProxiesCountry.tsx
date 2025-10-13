'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Box, Typography } from '@mui/material'

import { List } from 'lucide-react'

import BoxCustom from './BoxCustom'

interface ProxiesCountryProps {
  data: any
}

export default function ProxiesCountry({ data }: ProxiesCountryProps) {
  const [provinces, setProvinces] = useState(data)

  useEffect(() => {
    const interval = setInterval(
      () => {
        setProvinces(prev =>
          prev.map(p => ({
            ...p,

            count: Math.floor(Math.random() * 1500) + 1
          }))
        )
      },
      2 * 60 * 1000
    ) // 2 phút = 120000 ms

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <BoxCustom>
        <div>
          <div className='header-left'>
            <div className='page-icon'>
              <List size={17} />
            </div>
            <div>
              <h5 className='mb-0 font-semibold'>Proxy theo tỉnh thành</h5>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4'>
          {provinces.map(item => (
            <Box key={item.country} className='flex items-center p-2 gap-2 rounded font-semibold'>
              <Image src={`/images/proxyCountry/${item.flag}.png`} width={25} height={20} alt={item.country} />
              <span>{item.country} -</span>
              <span className='font-bold'>{item.count}</span>
            </Box>
          ))}
        </div>
      </BoxCustom>
    </>
  )
}
