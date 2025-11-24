'use client'

import { useState, useEffect, useMemo } from 'react'

import { useParams, useRouter } from 'next/navigation'
import './styles.css'

import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'

import ProxyCard from '@/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard'
import OrderProxyPage from './OrderProxyPage'
import { Box, Grid2, Typography, CircularProgress, TextField, InputAdornment } from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Search } from 'lucide-react'
import { useCountries } from '@/hooks/apis/useCountries'

interface StaticProxyPageProps {
  data: any
}

export default function StaticProxyPage({ data }: StaticProxyPageProps) {
  const [currentView, setCurrentView] = useState<'form' | 'table'>('form')
  const [searchCountry, setSearchCountry] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')
  const [selectedProxyType, setSelectedProxyType] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const { data: countries, isLoading: isLoadingCountries } = useCountries()

  // Debug: Log giá trị của các state
  useEffect(() => {
    console.log('State values:', { selectedVersion, selectedProxyType, selectedCountry })
  }, [selectedVersion, selectedProxyType, selectedCountry])

  // Lọc danh sách quốc gia theo search
  const filteredCountries = useMemo(
    () =>
      countries?.filter((country: any) =>
        (country.name || country.label || '').toLowerCase().includes(searchCountry.toLowerCase())
      ),
    [countries, searchCountry]
  )

  // Lọc danh sách provider theo các filter
  const filteredProviders = useMemo(
    () =>
      data?.filter((provider: any) => {
        // Filter theo version
        if (selectedVersion && provider.ip_version?.toLowerCase() !== selectedVersion.toLowerCase()) {
          return false
        }

        // Filter theo proxy type
        if (selectedProxyType && provider.proxy_type?.toLowerCase() !== selectedProxyType.toLowerCase()) {
          return false
        }

        // Filter theo country (giả sử provider có trường country_code hoặc country)
        if (selectedCountry && provider.country_code !== selectedCountry && provider.country !== selectedCountry) {
          return false
        }

        return true
      }),
    [data, selectedVersion, selectedProxyType, selectedCountry]
  )

  // Refetch data khi chuyển sang tab table để đảm bảo hiển thị đơn hàng mới nhất
  useEffect(() => {
    if (currentView === 'table' && status === 'authenticated') {
      // Invalidate và refetch query để đảm bảo data mới nhất
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  }, [currentView, status, queryClient])

  return (
    <div className='flex flex-col'>
      <div className='mb-2'>
        <div className='flex items-center justify-start'>
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mua hàng
            </button>
            <button
              disabled={status === 'unauthenticated'}
              onClick={() => setCurrentView('table')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${status === 'unauthenticated' ? 'cursor-not-allowed' : ''} ${
                currentView === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {currentView === 'form' && (
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 4, lg: 2 }}>
            <div style={{ position: 'sticky', top: '60px' }} className='proxy-card-column '>
              <Box className='flex gap-3 flex-col'>
                <Box>
                  <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                    Version
                  </Typography>
                  <RadioGroup
                    key='version-radio-group'
                    aria-label='version'
                    name='version'
                    value={selectedVersion}
                    onChange={e => setSelectedVersion(e.target.value)}
                  >
                    <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                    <FormControlLabel value='ipv4' control={<Radio />} label='V4' />
                    <FormControlLabel value='ipv6' control={<Radio />} label='V6' />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                    Loại proxy
                  </Typography>
                  <RadioGroup
                    key='proxy-type-radio-group'
                    aria-label='proxy-type'
                    name='proxy-type'
                    value={selectedProxyType}
                    onChange={e => setSelectedProxyType(e.target.value)}
                  >
                    <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                    <FormControlLabel value='datacenter' control={<Radio />} label='Datacenter' />
                    <FormControlLabel value='residential' control={<Radio />} label='Residential' />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                    Quốc gia
                  </Typography>

                  {/* Search input */}
                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Tìm kiếm quốc gia...'
                    value={searchCountry}
                    onChange={e => setSearchCountry(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search size={18} />
                        </InputAdornment>
                      )
                    }}
                  />

                  <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                    {isLoadingCountries ? (
                      <Box display='flex' justifyContent='center' p={2}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <RadioGroup
                        key='countries-radio-group'
                        aria-label='countries'
                        name='countries'
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                      >
                        <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                        {filteredCountries?.length > 0 ? (
                          filteredCountries.map((country: any) => (
                            <FormControlLabel
                              key={country.code || country.id}
                              value={country.code || country.id}
                              control={<Radio />}
                              label={country.name || country.label}
                            />
                          ))
                        ) : (
                          <Typography variant='body2' color='text.secondary' sx={{ p: 2, textAlign: 'center' }}>
                            Không tìm thấy quốc gia nào
                          </Typography>
                        )}
                      </RadioGroup>
                    )}
                  </Box>
                </Box>
              </Box>
            </div>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8, lg: 10 }}>
            <Grid2 container spacing={2}>
              {filteredProviders?.length > 0 ? (
                filteredProviders.map((provider: any, index: any) => (
                  <Grid2 key={index} size={{ xs: 12, md: 12, lg: 4 }}>
                    <ProxyCard provider={provider} isFirstCard={index === 0} />
                  </Grid2>
                ))
              ) : (
                <Grid2 size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '300px',
                      p: 4
                    }}
                  >
                    <Typography variant='h6' color='text.secondary' gutterBottom>
                      Không tìm thấy gói proxy phù hợp
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Vui lòng thử thay đổi bộ lọc để xem thêm các gói khác
                    </Typography>
                  </Box>
                </Grid2>
              )}
            </Grid2>
          </Grid2>
        </Grid2>
      )}

      {currentView === 'table' && <OrderProxyPage />}
    </div>
  )
}
