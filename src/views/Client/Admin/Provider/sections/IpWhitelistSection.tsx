import { Controller, useWatch } from 'react-hook-form'
import Grid2 from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

import CustomTextField from '@core/components/mui/TextField'
import FieldHint from '../components/FieldHint'
import type { SectionProps } from '../ProviderFormTypes'

export default function IpWhitelistSection({ control }: SectionProps) {
  const enabled = useWatch({ control, name: 'ip_config.enabled' })

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Controller
          name='ip_config.enabled'
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <CustomTextField
              {...field}
              value={value ? 'true' : 'false'}
              onChange={(e) => onChange(e.target.value === 'true')}
              fullWidth select label='Hỗ trợ IP Whitelist'
            >
              <MenuItem value='false'>Tắt</MenuItem>
              <MenuItem value='true'>Bật</MenuItem>
            </CustomTextField>
          )}
        />
      </Grid2>

      {enabled && (
        <>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller name='ip_config.mode' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label={<>Thời điểm gửi IP <FieldHint text='on_buy: 1 lần khi mua. on_rotate: mỗi lần xoay.' /></>}>
                <MenuItem value='on_buy'>Khi mua (1 lần)</MenuItem>
                <MenuItem value='on_rotate'>Mỗi lần xoay</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='ip_config.max_ips' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth type='number' label={<>Số IP tối đa <FieldHint text='Provider cho phép bao nhiêu IP' /></>} placeholder='1' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='ip_config.param' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label={<>Tên param IP <FieldHint text='VD: ip, allowed_ips' /></>} placeholder='ip' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller name='ip_config.param_format' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label={<>Format gửi IP <FieldHint text='single: ip=1.2.3.4. comma: ip=1,2. array: ip[]=1&ip[]=2' /></>}>
                <MenuItem value='single'>Đơn (ip=1.2.3.4)</MenuItem>
                <MenuItem value='comma'>Comma (ip=1.2.3.4,5.6.7.8)</MenuItem>
                <MenuItem value='array'>Array (ip[]=...)</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
        </>
      )}
    </Grid2>
  )
}
