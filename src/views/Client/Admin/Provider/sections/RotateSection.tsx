import { Controller, useWatch } from 'react-hook-form'
import Grid2 from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

import CustomTextField from '@core/components/mui/TextField'
import FieldHint from '../components/FieldHint'
import type { SectionProps } from '../ProviderFormTypes'

export default function RotateSection({ control }: SectionProps) {
  const enabled = useWatch({ control, name: 'rotate.enabled' })

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Controller
          name='rotate.enabled'
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <CustomTextField
              {...field}
              value={value ? 'true' : 'false'}
              onChange={(e) => onChange(e.target.value === 'true')}
              fullWidth select label='Bật cấu hình xoay'
            >
              <MenuItem value='false'>Tắt</MenuItem>
              <MenuItem value='true'>Bật</MenuItem>
            </CustomTextField>
          )}
        />
      </Grid2>

      {enabled && (
        <>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.method' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Method'>
                <MenuItem value='GET'>GET</MenuItem>
                <MenuItem value='POST'>POST</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 9 }}>
            <Controller name='rotate.url' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='URL xoay proxy' placeholder='https://api.provider.com/get' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.auth_type' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label={<>Kiểu xác thực <FieldHint text='none: không gửi token, chỉ gửi key proxy. query/header/bearer: gửi token provider.' /></>}>
                <MenuItem value='none'>Không (chỉ gửi key proxy)</MenuItem>
                <MenuItem value='query'>Query param</MenuItem>
                <MenuItem value='header'>Header</MenuItem>
                <MenuItem value='bearer'>Bearer token</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.auth_param' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Param auth' placeholder='key' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.key_source' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label={<>Key source <FieldHint text='Field nào trong OrderItem làm key xoay' /></>}>
                <MenuItem value='key'>key</MenuItem>
                <MenuItem value='provider_key'>provider_key</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller name='rotate.params_json' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label={<>Params mặc định <FieldHint text='Params cố định gửi kèm mỗi lần xoay. VD: {"tinh": "hcm", "nhamang": "viettel"}' /></>} placeholder='{"tinh": "hcm"}' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.response_http' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field HTTP' placeholder='http' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.response_socks5' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field SOCKS5' placeholder='socks5' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='rotate.double_ampersand' control={control} render={({ field: { value, onChange, ...field } }) => (
              <CustomTextField
                {...field}
                value={value ? 'true' : 'false'}
                onChange={(e) => onChange(e.target.value === 'true')}
                fullWidth select
                label={<>Double ampersand <FieldHint text='Dùng && thay vì & nối params' /></>}
              >
                <MenuItem value='false'>Không (&)</MenuItem>
                <MenuItem value='true'>Có (&&)</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
        </>
      )}
    </Grid2>
  )
}
