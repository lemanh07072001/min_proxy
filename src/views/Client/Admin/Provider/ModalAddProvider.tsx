'use client'

import { useEffect, useState, useRef } from 'react'

import { useForm, Controller, useWatch, type Control } from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { ChevronDown, Info } from 'lucide-react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'

import { useCreateProvider, useUpdateProvider } from '@/hooks/apis/useProviders'

// ─── Types ──────────────────────────────────────────

interface ApiConfigBuyResponse {
  type: string
  success_field: string
  success_value: number | string
  error_status: number | string
  proxies_path: string
  proxy_format: string
  proxy_key_field: string
  proxy_fields_ip: string
  proxy_fields_port: string
  proxy_fields_user: string
  proxy_fields_pass: string
  proxy_fields_type: string
  item_id_field: string
}

interface FetchProxiesConfig {
  url: string
  method: string
  auth_type: string
  auth_param: string
  success_field: string
  success_value: string
  proxies_path: string
  proxy_format: string
  proxy_key_field: string
  proxy_fields_ip: string
  proxy_fields_port: string
  proxy_fields_user: string
  proxy_fields_pass: string
  proxy_fields_type: string
  item_id_field: string
  pagination_enabled: boolean
  page_param: string
  per_page_param: string
  per_page: string
  last_page_path: string
}

interface ApiConfigBuy {
  enabled: boolean
  method: string
  url: string
  url_1: string
  url_7: string
  url_30: string
  use_url_by_duration: boolean
  auth_type: string
  auth_param: string
  params_json: string
  quantity_param: string
  double_ampersand: boolean
  duration_param: string
  duration_map_1: string
  duration_map_7: string
  duration_map_30: string
  user_override_enabled: boolean
  user_override_user_param: string
  user_override_pass_param: string
  protocol_override_enabled: boolean
  protocol_override_param: string
  protocol_override_http: string
  protocol_override_socks5: string
  response_mode: string
  fetch_proxies: FetchProxiesConfig
  response: ApiConfigBuyResponse
}

interface ApiConfigRotate {
  enabled: boolean
  method: string
  url: string
  auth_type: string
  auth_param: string
  key_source: string
  params_json: string
  response_http: string
  response_socks5: string
  double_ampersand: boolean
}

interface IpConfig {
  enabled: boolean
  mode: string
  max_ips: number
  param: string
  param_format: string
}

interface FormValues {
  title: string
  token_api: string
  provider_code: string
  order: string
  status: string
  rotation_interval: string
  buy_rotating: ApiConfigBuy
  buy_static: ApiConfigBuy
  rotate: ApiConfigRotate
  ip_config: IpConfig
}

interface ModalAddProviderProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  providerData?: any
}

// ─── Helpers ────────────────────────────────────────

function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip title={text} placement='top' arrow>
      <IconButton size='small' sx={{ ml: 0.5, p: 0.25 }}>
        <Info size={14} />
      </IconButton>
    </Tooltip>
  )
}

const defaultFetchProxies: FetchProxiesConfig = {
  url: '',
  method: 'GET',
  auth_type: 'inherit',
  auth_param: '',
  success_field: '',
  success_value: '',
  proxies_path: 'data.proxies',
  proxy_format: 'fields',
  proxy_key_field: '',
  proxy_fields_ip: 'ip',
  proxy_fields_port: 'port',
  proxy_fields_user: 'user',
  proxy_fields_pass: 'pass',
  proxy_fields_type: '',
  item_id_field: '',
  pagination_enabled: false,
  page_param: 'page',
  per_page_param: 'per_page',
  per_page: '50',
  last_page_path: 'data.last_page',
}

const defaultBuy: ApiConfigBuy = {
  enabled: false,
  method: 'GET',
  url: '',
  url_1: '', url_7: '', url_30: '',
  use_url_by_duration: false,
  auth_type: 'query',
  auth_param: 'key',
  params_json: '',
  quantity_param: 'soluong',
  double_ampersand: false,
  duration_param: '',
  duration_map_1: '', duration_map_7: '', duration_map_30: '',
  user_override_enabled: false,
  user_override_user_param: 'user',
  user_override_pass_param: 'password',
  protocol_override_enabled: false,
  protocol_override_param: 'type',
  protocol_override_http: 'HTTP',
  protocol_override_socks5: 'SOCKS5',
  response_mode: 'immediate',
  fetch_proxies: { ...defaultFetchProxies },
  response: {
    type: 'array_last_status',
    success_field: 'statusCode',
    success_value: 200,
    error_status: 101,
    proxies_path: 'data.proxies',
    proxy_format: 'key',
    proxy_key_field: 'keyxoay',
    proxy_fields_ip: '', proxy_fields_port: '',
    proxy_fields_user: '', proxy_fields_pass: '', proxy_fields_type: '',
    item_id_field: '',
  }
}

/** Parse 1 buy section from api_config */
function parseBuySection(buy: any): ApiConfigBuy {
  if (!buy) return { ...defaultBuy }

  const buyResp = buy.response || {}
  const proxyFields = buyResp.proxy_fields || {}
  const urlByDuration = buy.url_by_duration || {}
  const durationMap = buy.duration_map || {}

  return {
    enabled: true,
    method: buy.method || 'GET',
    url: buy.url || '',
    url_1: urlByDuration['1'] || '',
    url_7: urlByDuration['7'] || '',
    url_30: urlByDuration['30'] || '',
    use_url_by_duration: !!buy.url_by_duration,
    auth_type: buy.auth_type || 'query',
    auth_param: buy.auth_param || 'key',
    params_json: buy.params ? JSON.stringify(buy.params) : '',
    quantity_param: buy.quantity_param || 'soluong',
    double_ampersand: buy.double_ampersand || false,
    duration_param: buy.duration_param || '',
    duration_map_1: durationMap['1'] || '',
    duration_map_7: durationMap['7'] || '',
    duration_map_30: durationMap['30'] || '',
    user_override_enabled: !!buy.user_override,
    user_override_user_param: buy.user_override?.user_param || 'user',
    user_override_pass_param: buy.user_override?.pass_param || 'password',
    protocol_override_enabled: !!buy.protocol_override,
    protocol_override_param: buy.protocol_override?.param || 'type',
    protocol_override_http: buy.protocol_override?.map?.http || 'HTTP',
    protocol_override_socks5: buy.protocol_override?.map?.socks5 || 'SOCKS5',
    response_mode: buy.response_mode || 'immediate',
    fetch_proxies: (() => {
      const fp = buy.fetch_proxies
      if (!fp) return { ...defaultFetchProxies }
      const fpResp = fp.response || {}
      const fpFields = fpResp.proxy_fields || {}
      const pg = fp.pagination || null
      return {
        url: fp.url || '',
        method: fp.method || 'GET',
        auth_type: fp.auth_type ? fp.auth_type : 'inherit',
        auth_param: fp.auth_param || '',
        success_field: fpResp.success_field || '',
        success_value: fpResp.success_value != null ? String(fpResp.success_value) : '',
        proxies_path: fpResp.proxies_path || 'data.proxies',
        proxy_format: fpResp.proxy_format || 'fields',
        proxy_key_field: fpResp.proxy_key_field || fpResp.proxy_string_field || '',
        proxy_fields_ip: fpFields.ip || 'ip',
        proxy_fields_port: fpFields.port || 'port',
        proxy_fields_user: fpFields.user || 'user',
        proxy_fields_pass: fpFields.pass || 'pass',
        proxy_fields_type: fpFields.type || '',
        item_id_field: fpResp.item_id_field || '',
        pagination_enabled: !!pg,
        page_param: pg?.page_param || 'page',
        per_page_param: pg?.per_page_param || 'per_page',
        per_page: pg?.per_page ? String(pg.per_page) : '50',
        last_page_path: pg?.last_page_path || 'data.last_page',
      }
    })(),
    response: {
      type: buyResp.type || 'array_last_status',
      success_field: buyResp.success_field || 'statusCode',
      success_value: buyResp.success_value ?? 200,
      error_status: buyResp.error_status ?? 101,
      proxies_path: buyResp.proxies_path || 'data.proxies',
      proxy_format: buyResp.proxy_format || 'key',
      proxy_key_field: buyResp.proxy_key_field || buyResp.proxy_string_field || 'keyxoay',
      proxy_fields_ip: proxyFields.ip || '',
      proxy_fields_port: proxyFields.port || '',
      proxy_fields_user: proxyFields.user || '',
      proxy_fields_pass: proxyFields.pass || '',
      proxy_fields_type: proxyFields.type || '',
      item_id_field: buyResp.item_id_field || '',
    }
  }
}

/** Parse api_config JSON from DB into form values */
function parseApiConfig(apiConfig: any): Partial<FormValues> {
  if (!apiConfig) return {}

  const rotate = apiConfig.rotate || {}
  const ipCfg = apiConfig.ip_config || {}

  // Backward compat: nếu có "buy" (cũ) → map vào buy_rotating
  const buyRotating = apiConfig.buy_rotating || apiConfig.buy || null
  const buyStatic = apiConfig.buy_static || null

  return {
    buy_rotating: parseBuySection(buyRotating),
    buy_static: parseBuySection(buyStatic),
    rotate: {
      enabled: !!apiConfig.rotate,
      method: rotate.method || 'GET',
      url: rotate.url || '',
      auth_type: rotate.auth_type || 'query',
      auth_param: rotate.auth_param || 'key',
      key_source: rotate.key_source || 'key',
      params_json: rotate.params ? JSON.stringify(rotate.params) : '',
      response_http: rotate.response?.proxy_fields?.http || 'http',
      response_socks5: rotate.response?.proxy_fields?.socks5 || 'socks5',
      double_ampersand: rotate.double_ampersand || false,
    },
    ip_config: {
      enabled: !!apiConfig.ip_config,
      mode: ipCfg.mode || 'on_rotate',
      max_ips: ipCfg.max_ips || 1,
      param: ipCfg.param || 'ip',
      param_format: ipCfg.param_format || 'single',
    }
  }
}

/** Build 1 buy section to JSON */
function buildBuySection(buy: ApiConfigBuy): object | null {
  if (!buy.enabled) return null

  const hasUrl = buy.url || buy.url_1
  if (!hasUrl) return null

  const result: any = {
    method: buy.method,
    auth_type: buy.auth_type,
    auth_param: buy.auth_param,
    quantity_param: buy.quantity_param,
  }

  if (buy.use_url_by_duration) {
    result.url_by_duration = {} as any
    if (buy.url_1) result.url_by_duration['1'] = buy.url_1
    if (buy.url_7) result.url_by_duration['7'] = buy.url_7
    if (buy.url_30) result.url_by_duration['30'] = buy.url_30
  } else if (buy.url) {
    result.url = buy.url
  }

  if (buy.params_json) {
    try { result.params = JSON.parse(buy.params_json) } catch { /* skip */ }
  }

  if (buy.double_ampersand) result.double_ampersand = true

  // Duration param (dùng cho cả URL đơn và URL theo thời hạn)
  if (buy.duration_param) {
    result.duration_param = buy.duration_param
    const hasMap = buy.duration_map_1 || buy.duration_map_7 || buy.duration_map_30
    if (hasMap) {
      result.duration_map = {} as any
      if (buy.duration_map_1) result.duration_map['1'] = buy.duration_map_1
      if (buy.duration_map_7) result.duration_map['7'] = buy.duration_map_7
      if (buy.duration_map_30) result.duration_map['30'] = buy.duration_map_30
    }
  }

  // User override: cho phép user nhập custom user:pass khi mua
  if (buy.user_override_enabled) {
    result.user_override = {
      user_param: buy.user_override_user_param || 'user',
      pass_param: buy.user_override_pass_param || 'password',
    }
  }

  // Protocol override: map protocol user chọn sang param provider
  if (buy.protocol_override_enabled) {
    result.protocol_override = {
      param: buy.protocol_override_param || 'type',
      map: {
        http: buy.protocol_override_http || 'HTTP',
        socks5: buy.protocol_override_socks5 || 'SOCKS5',
      }
    }
  }

  const resp: any = {
    type: buy.response.type,
    proxy_format: buy.response.proxy_format,
  }

  if (buy.response.success_field) resp.success_field = buy.response.success_field
  if (buy.response.success_value !== '') resp.success_value = Number(buy.response.success_value)
  if (buy.response.error_status !== '') resp.error_status = Number(buy.response.error_status)
  if (buy.response.type === 'object' && buy.response.proxies_path) resp.proxies_path = buy.response.proxies_path

  if (buy.response.proxy_format === 'key' && buy.response.proxy_key_field) {
    resp.proxy_key_field = buy.response.proxy_key_field
  }

  if (buy.response.proxy_format === 'string' && buy.response.proxy_key_field) {
    resp.proxy_string_field = buy.response.proxy_key_field
  }

  if (buy.response.proxy_format === 'fields') {
    resp.proxy_fields = {} as any
    if (buy.response.proxy_fields_ip) resp.proxy_fields.ip = buy.response.proxy_fields_ip
    if (buy.response.proxy_fields_port) resp.proxy_fields.port = buy.response.proxy_fields_port
    if (buy.response.proxy_fields_user) resp.proxy_fields.user = buy.response.proxy_fields_user
    if (buy.response.proxy_fields_pass) resp.proxy_fields.pass = buy.response.proxy_fields_pass
    if (buy.response.proxy_fields_type) resp.proxy_fields.type = buy.response.proxy_fields_type
  }

  // Provider item ID field (VD: idproxy)
  if (buy.response.item_id_field) resp.item_id_field = buy.response.item_id_field

  // Deferred: order_id_field thay vì proxy data
  if (buy.response_mode === 'deferred') {
    result.response_mode = 'deferred'
    resp.order_id_field = resp.proxies_path || 'data.id' // Reuse proxies_path as order_id_field for deferred

    // fetch_proxies config
    const fp = buy.fetch_proxies
    if (fp.url) {
      const fetchResult: any = {
        url: fp.url,
        method: fp.method || 'GET',
      }

      // Auth: inherit từ buy section hoặc custom
      if (fp.auth_type !== 'inherit') {
        fetchResult.auth_type = fp.auth_type
        if (fp.auth_param) fetchResult.auth_param = fp.auth_param
      }

      // Response
      const fpResp: any = {}
      if (fp.success_field) fpResp.success_field = fp.success_field
      if (fp.success_value !== '') {
        const numVal = Number(fp.success_value)
        fpResp.success_value = isNaN(numVal) ? fp.success_value : numVal
      }
      if (fp.proxies_path) fpResp.proxies_path = fp.proxies_path
      fpResp.proxy_format = fp.proxy_format || 'fields'

      if (fp.proxy_format === 'key' && fp.proxy_key_field) {
        fpResp.proxy_key_field = fp.proxy_key_field
      }
      if (fp.proxy_format === 'string' && fp.proxy_key_field) {
        fpResp.proxy_string_field = fp.proxy_key_field
      }
      if (fp.proxy_format === 'fields') {
        fpResp.proxy_fields = {} as any
        if (fp.proxy_fields_ip) fpResp.proxy_fields.ip = fp.proxy_fields_ip
        if (fp.proxy_fields_port) fpResp.proxy_fields.port = fp.proxy_fields_port
        if (fp.proxy_fields_user) fpResp.proxy_fields.user = fp.proxy_fields_user
        if (fp.proxy_fields_pass) fpResp.proxy_fields.pass = fp.proxy_fields_pass
        if (fp.proxy_fields_type) fpResp.proxy_fields.type = fp.proxy_fields_type
      }
      if (fp.item_id_field) fpResp.item_id_field = fp.item_id_field

      fetchResult.response = fpResp

      // Pagination
      if (fp.pagination_enabled) {
        fetchResult.pagination = {
          page_param: fp.page_param || 'page',
          per_page_param: fp.per_page_param || 'per_page',
          per_page: parseInt(fp.per_page) || 50,
          last_page_path: fp.last_page_path || 'data.last_page',
        }
      }

      result.fetch_proxies = fetchResult
    }
  }

  result.response = resp

  return result
}

/** Convert form values back to api_config JSON for BE */
function buildApiConfig(form: FormValues): object | null {
  const config: any = {}

  const buyRotating = buildBuySection(form.buy_rotating)
  const buyStatic = buildBuySection(form.buy_static)

  if (buyRotating) config.buy_rotating = buyRotating
  if (buyStatic) config.buy_static = buyStatic

  if (form.rotate.enabled) {
    config.rotate = {
      method: form.rotate.method,
      url: form.rotate.url,
      auth_type: form.rotate.auth_type,
      auth_param: form.rotate.auth_param,
      key_source: form.rotate.key_source,
      ...(form.rotate.params_json ? { params: (() => { try { return JSON.parse(form.rotate.params_json) } catch { return undefined } })() } : {}),
      double_ampersand: form.rotate.double_ampersand || undefined,
      response: {
        proxy_fields: {
          http: form.rotate.response_http || 'http',
          socks5: form.rotate.response_socks5 || 'socks5',
        }
      }
    }
  }

  if (form.ip_config.enabled) {
    config.ip_config = {
      mode: form.ip_config.mode,
      max_ips: Number(form.ip_config.max_ips) || 1,
      param: form.ip_config.param,
      param_format: form.ip_config.param_format,
    }
  }

  return Object.keys(config).length > 0 ? config : null
}

// ─── Reusable Buy Config Section ────────────────────

function BuyConfigFields({
  prefix,
  control,
}: {
  prefix: 'buy_rotating' | 'buy_static'
  control: Control<FormValues>
}) {
  // Chỉ watch các field cần cho conditional rendering
  const enabled = useWatch({ control, name: `${prefix}.enabled` })
  const useUrlByDuration = useWatch({ control, name: `${prefix}.use_url_by_duration` })
  const responseType = useWatch({ control, name: `${prefix}.response.type` })
  const proxyFormat = useWatch({ control, name: `${prefix}.response.proxy_format` })
  const userOverrideEnabled = useWatch({ control, name: `${prefix}.user_override_enabled` })
  const protocolOverrideEnabled = useWatch({ control, name: `${prefix}.protocol_override_enabled` })
  const durationParam = useWatch({ control, name: `${prefix}.duration_param` })
  const responseMode = useWatch({ control, name: `${prefix}.response_mode` })
  const fetchPaginationEnabled = useWatch({ control, name: `${prefix}.fetch_proxies.pagination_enabled` })
  const fetchProxyFormat = useWatch({ control, name: `${prefix}.fetch_proxies.proxy_format` })

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Controller
          name={`${prefix}.enabled`}
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <CustomTextField
              {...field}
              value={value ? 'true' : 'false'}
              onChange={(e) => onChange(e.target.value === 'true')}
              fullWidth select label='Bật cấu hình mua'
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
            <Controller
              name={`${prefix}.method`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth select label='HTTP Method'>
                  <MenuItem value='GET'>GET</MenuItem>
                  <MenuItem value='POST'>POST</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller
              name={`${prefix}.auth_type`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth select label={<>Kiểu xác thực <FieldHint text='query: token qua URL. header: qua HTTP header. bearer: qua Authorization' /></>}>
                  <MenuItem value='query'>Query param</MenuItem>
                  <MenuItem value='header'>Header</MenuItem>
                  <MenuItem value='bearer'>Bearer token</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller
              name={`${prefix}.auth_param`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label={<>Param auth <FieldHint text='Tên param chứa token. VD: key, x-api-key' /></>} placeholder='key' />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller
              name={`${prefix}.quantity_param`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label={<>Param số lượng <FieldHint text='Tên param số lượng proxy. VD: soluong, quantity' /></>} placeholder='soluong' />
              )}
            />
          </Grid2>

          {/* URL config */}
          <Grid2 size={{ xs: 12 }}>
            <Controller
              name={`${prefix}.use_url_by_duration`}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <CustomTextField
                  {...field}
                  value={value ? 'duration' : 'single'}
                  onChange={(e) => onChange(e.target.value === 'duration')}
                  fullWidth select
                  label={<>Kiểu URL <FieldHint text='URL đơn: 1 URL. URL theo thời hạn: riêng cho ngày/tuần/tháng' /></>}
                >
                  <MenuItem value='single'>URL đơn (1 URL)</MenuItem>
                  <MenuItem value='duration'>URL theo thời hạn (ngày/tuần/tháng)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>

          {!useUrlByDuration ? (
            <Grid2 size={{ xs: 12 }}>
              <Controller
                name={`${prefix}.url`}
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='URL mua proxy' placeholder='https://api.provider.com/buy' />
                )}
              />
            </Grid2>
          ) : (
            <>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller name={`${prefix}.url_1`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='URL mua ngày' placeholder='https://...' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller name={`${prefix}.url_7`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='URL mua tuần' placeholder='https://...' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller name={`${prefix}.url_30`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='URL mua tháng' placeholder='https://...' />
                )} />
              </Grid2>
            </>
          )}

          {/* Duration param — dùng cho cả URL đơn và URL theo thời hạn */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller
              name={`${prefix}.duration_param`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label={<>Param thời hạn <FieldHint text='Tên param gửi thời hạn mua. VD: thoigian, duration, days. Bỏ trống nếu không cần.' /></>} placeholder='thoigian' />
              )}
            />
          </Grid2>
          {durationParam && (
            <>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.duration_map_1`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>1 ngày = <FieldHint text='Giá trị gửi cho provider khi mua 1 ngày. Bỏ trống = gửi số 1' /></>} placeholder='1' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.duration_map_7`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>7 ngày = <FieldHint text='VD: 7, weekly, 7d' /></>} placeholder='7' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.duration_map_30`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>30 ngày = <FieldHint text='VD: 30, monthly, 30d' /></>} placeholder='30' />
                )} />
              </Grid2>
            </>
          )}

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`${prefix}.params_json`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label={<>Params mặc định (JSON) <FieldHint text='Params cố định. VD: {"thoigian": 1}' /></>} placeholder='{"thoigian": 1}' />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`${prefix}.double_ampersand`}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <CustomTextField
                  {...field}
                  value={value ? 'true' : 'false'}
                  onChange={(e) => onChange(e.target.value === 'true')}
                  fullWidth select
                  label={<>Double ampersand <FieldHint text='API dùng && thay vì & nối params (hiếm)' /></>}
                >
                  <MenuItem value='false'>Không</MenuItem>
                  <MenuItem value='true'>Có (&&)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>

          {/* User override: cho user nhập custom user:pass khi mua */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller
              name={`${prefix}.user_override_enabled`}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <CustomTextField
                  {...field}
                  value={value ? 'true' : 'false'}
                  onChange={(e) => onChange(e.target.value === 'true')}
                  fullWidth select
                  label={<>Cho user nhập User:Pass <FieldHint text='Bật nếu provider cho phép user tự chọn username/password. Mặc định = random từ provider.' /></>}
                >
                  <MenuItem value='false'>Không (random)</MenuItem>
                  <MenuItem value='true'>Có (user chọn)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>
          {userOverrideEnabled && (
            <>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.user_override_user_param`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Param username <FieldHint text='Tên param gửi username cho provider. VD: user, username, login' /></>} placeholder='user' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.user_override_pass_param`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Param password <FieldHint text='Tên param gửi password cho provider. VD: password, pass, pwd' /></>} placeholder='password' />
                )} />
              </Grid2>
            </>
          )}

          {/* Protocol override: map protocol sang param provider */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller
              name={`${prefix}.protocol_override_enabled`}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <CustomTextField
                  {...field}
                  value={value ? 'true' : 'false'}
                  onChange={(e) => onChange(e.target.value === 'true')}
                  fullWidth select
                  label={<>Map protocol vào param <FieldHint text='Bật nếu provider cần param type/protocol. User chọn HTTP/SOCKS5 → gửi giá trị tương ứng.' /></>}
                >
                  <MenuItem value='false'>Không</MenuItem>
                  <MenuItem value='true'>Có</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>
          {protocolOverrideEnabled && (
            <>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.protocol_override_param`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Param <FieldHint text='Tên param. VD: type, protocol' /></>} placeholder='type' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.protocol_override_http`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='HTTP =' placeholder='HTTP' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 4, sm: 2.67 }}>
                <Controller name={`${prefix}.protocol_override_socks5`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='SOCKS5 =' placeholder='SOCKS5' />
                )} />
              </Grid2>
            </>
          )}

          {/* Response mode: immediate vs deferred */}
          <Grid2 size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              Chế độ trả proxy
              <FieldHint text='Immediate: provider trả proxy ngay. Deferred: provider trả mã đơn, lấy proxy sau bằng API khác.' />
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller
              name={`${prefix}.response_mode`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth select label='Chế độ trả proxy'>
                  <MenuItem value='immediate'>Trả proxy ngay</MenuItem>
                  <MenuItem value='deferred'>Tạo đơn trước, lấy proxy sau</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>

          {/* Fetch proxies config — chỉ hiện khi deferred */}
          {responseMode === 'deferred' && (
            <>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1, mb: 0.5, px: 1, py: 0.5, background: '#fffbeb', borderRadius: 1, border: '1px solid #fde68a' }}>
                  Provider sẽ trả mã đơn hàng khi mua. Hệ thống sẽ tự động poll API bên dưới để lấy proxy.
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller name={`${prefix}.fetch_proxies.url`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>URL lấy proxy <FieldHint text='Dùng {order_id} làm placeholder. VD: https://api.provider.com/orders/{order_id}/proxies' /></>} placeholder='https://api.provider.com/orders/{order_id}' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.method`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label='Method'>
                    <MenuItem value='GET'>GET</MenuItem>
                    <MenuItem value='POST'>POST</MenuItem>
                  </CustomTextField>
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.auth_type`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label={<>Auth <FieldHint text='Inherit: dùng cùng auth với API mua. Hoặc chọn auth riêng.' /></>}>
                    <MenuItem value='inherit'>Kế thừa từ API mua</MenuItem>
                    <MenuItem value='query'>Query param</MenuItem>
                    <MenuItem value='header'>Header</MenuItem>
                    <MenuItem value='bearer'>Bearer token</MenuItem>
                  </CustomTextField>
                )} />
              </Grid2>

              {/* Response config cho fetch */}
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.success_field`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Field thành công <FieldHint text='Bỏ trống nếu không cần check. VD: success, status' /></>} placeholder='success' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.success_value`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='true' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.proxies_path`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Đường dẫn proxy <FieldHint text='Dot path đến mảng proxy. VD: data.proxies, data.data' /></>} placeholder='data.proxies' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Controller name={`${prefix}.fetch_proxies.proxy_format`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label='Format proxy'>
                    <MenuItem value='key'>Key đơn</MenuItem>
                    <MenuItem value='string'>Chuỗi ip:port:user:pass</MenuItem>
                    <MenuItem value='fields'>Nhiều fields riêng</MenuItem>
                  </CustomTextField>
                )} />
              </Grid2>

              {fetchProxyFormat === 'fields' && (
                <>
                  <Grid2 size={{ xs: 6, sm: 2.4 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxy_fields_ip`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Field IP' placeholder='ip' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2.4 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxy_fields_port`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Field Port' placeholder='port' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2.4 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxy_fields_user`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Field User' placeholder='user' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2.4 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxy_fields_pass`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Field Pass' placeholder='pass' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2.4 }}>
                    <Controller name={`${prefix}.fetch_proxies.item_id_field`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label={<>Field ID <FieldHint text='ID proxy từ provider. Bỏ trống nếu không có.' /></>} placeholder='id' />
                    )} />
                  </Grid2>
                </>
              )}
              {(fetchProxyFormat === 'key' || fetchProxyFormat === 'string') && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller name={`${prefix}.fetch_proxies.proxy_key_field`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={fetchProxyFormat === 'key' ? 'Field chứa key' : 'Field chứa chuỗi proxy'} placeholder={fetchProxyFormat === 'key' ? 'keyxoay' : 'proxy'} />
                  )} />
                </Grid2>
              )}

              {/* Pagination */}
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name={`${prefix}.fetch_proxies.pagination_enabled`}
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <CustomTextField
                      {...field}
                      value={value ? 'true' : 'false'}
                      onChange={(e) => onChange(e.target.value === 'true')}
                      fullWidth select
                      label={<>Phân trang <FieldHint text='Bật nếu API lấy proxy trả kết quả phân trang (nhiều page)' /></>}
                    >
                      <MenuItem value='false'>Không phân trang</MenuItem>
                      <MenuItem value='true'>Có phân trang</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>
              {fetchPaginationEnabled && (
                <>
                  <Grid2 size={{ xs: 6, sm: 2 }}>
                    <Controller name={`${prefix}.fetch_proxies.page_param`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Param page' placeholder='page' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2 }}>
                    <Controller name={`${prefix}.fetch_proxies.per_page_param`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Param per_page' placeholder='per_page' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2 }}>
                    <Controller name={`${prefix}.fetch_proxies.per_page`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Số/trang' placeholder='50' type='number' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 2 }}>
                    <Controller name={`${prefix}.fetch_proxies.last_page_path`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label={<>Path last page <FieldHint text='Dot path đến tổng số page. VD: data.last_page, meta.last_page' /></>} placeholder='data.last_page' />
                    )} />
                  </Grid2>
                </>
              )}
            </>
          )}

          {/* Response config */}
          <Grid2 size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              Cấu hình Response {responseMode === 'deferred' ? '(API mua — trả mã đơn)' : ''}
              <FieldHint text={responseMode === 'deferred' ? 'Cách đọc mã đơn hàng từ response API mua' : 'Cách đọc kết quả từ API nhà cung cấp'} />
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 4 }}>
            <Controller
              name={`${prefix}.response.type`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth select label={<>Kiểu response <FieldHint text='array_last_status: lấy phần tử cuối check status. object: object đơn' /></>}>
                  <MenuItem value='array_last_status'>Array (check status cuối)</MenuItem>
                  <MenuItem value='object'>Object đơn</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 4 }}>
            <Controller
              name={`${prefix}.response.success_field`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label={<>Field thành công <FieldHint text='VD: statusCode, status, success' /></>} placeholder='statusCode' />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 2 }}>
            <Controller name={`${prefix}.response.success_value`} control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='200' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 2 }}>
            <Controller name={`${prefix}.response.error_status`} control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Giá trị lỗi' placeholder='101' />
            )} />
          </Grid2>
          {(responseType === 'object' || responseMode === 'deferred') && (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`${prefix}.response.proxies_path`}
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth
                    label={responseMode === 'deferred'
                      ? <>Đường dẫn mã đơn hàng <FieldHint text='Dot path đến order ID trong response. VD: data.id, data.order_id' /></>
                      : <>Đường dẫn proxy data <FieldHint text='Dot path. VD: data.proxies, result.list. Chỉ cần cho dạng Object.' /></>
                    }
                    placeholder={responseMode === 'deferred' ? 'data.id' : 'data.proxies'}
                  />
                )}
              />
            </Grid2>
          )}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`${prefix}.response.proxy_format`}
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth select label={<>Format proxy <FieldHint text='key: 1 field chứa key xoay. fields: nhiều field (ip, port, user, pass)' /></>}>
                  <MenuItem value='key'>Key đơn (VD: keyxoay)</MenuItem>
                  <MenuItem value='string'>Chuỗi ip:port:user:pass trong 1 field</MenuItem>
                  <MenuItem value='fields'>Nhiều fields riêng (ip, port, user, pass)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid2>

          {proxyFormat === 'string' && (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`${prefix}.response.proxy_key_field`}
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Field chứa chuỗi proxy <FieldHint text='Tên field chứa chuỗi ip:port:user:pass. VD: proxy, proxyhttp' /></>} placeholder='proxy' />
                )}
              />
            </Grid2>
          )}

          {proxyFormat === 'key' && (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`${prefix}.response.proxy_key_field`}
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Field chứa key <FieldHint text='VD: keyxoay, proxy_key' /></>} placeholder='keyxoay' />
                )}
              />
            </Grid2>
          )}

          {proxyFormat === 'fields' && (
            <>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.response.proxy_fields_ip`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Field IP' placeholder='ip' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.response.proxy_fields_port`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Field Port' placeholder='port' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.response.proxy_fields_user`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Field Username' placeholder='username' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.response.proxy_fields_pass`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Field Password' placeholder='password' />
                )} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Controller name={`${prefix}.response.proxy_fields_type`} control={control} render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Field Type' placeholder='type' />
                )} />
              </Grid2>
            </>
          )}

          {/* Provider item ID field — cho format fields hoặc string */}
          {(proxyFormat === 'fields' || proxyFormat === 'string') && (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`${prefix}.response.item_id_field`}
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label={<>Field ID nhà cung cấp <FieldHint text='Tên field chứa ID proxy từ provider. VD: idproxy, id, proxy_id. Lưu vào provider_item_id. Bỏ trống nếu không có.' /></>} placeholder='idproxy' />
                )}
              />
            </Grid2>
          )}
        </>
      )}
    </Grid2>
  )
}

// ─── Default values ─────────────────────────────────

const defaultValues: FormValues = {
  title: '',
  token_api: '',
  provider_code: '',
  order: '',
  status: 'active',
  rotation_interval: '',
  buy_rotating: { ...defaultBuy },
  buy_static: { ...defaultBuy },
  rotate: {
    enabled: false,
    method: 'GET',
    url: '',
    auth_type: 'query',
    auth_param: 'key',
    key_source: 'key',
    params_json: '',
    response_http: 'http',
    response_socks5: 'socks5',
    double_ampersand: false,
  },
  ip_config: {
    enabled: false,
    mode: 'on_rotate',
    max_ips: 1,
    param: 'ip',
    param_format: 'single',
  }
}

// ─── Component ──────────────────────────────────────

export default function ModalAddProvider({ open, onClose, type, providerData }: ModalAddProviderProps) {
  const createMutation = useCreateProvider()
  const updateMutation = useUpdateProvider(providerData?.id)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({ defaultValues })

  // Chỉ watch conditional fields cho rotate/ip sections
  const rotateEnabled = useWatch({ control, name: 'rotate.enabled' })
  const ipEnabled = useWatch({ control, name: 'ip_config.enabled' })
  // JSON preview với debounce 300ms
  const [jsonPreview, setJsonPreview] = useState('// Chưa có cấu hình API')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const config = buildApiConfig(values as FormValues)
        setJsonPreview(config ? JSON.stringify(config, null, 2) : '// Chưa có cấu hình API')
      }, 300)
    })

    return () => {
      subscription.unsubscribe()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [watch])

  useEffect(() => {
    if (!open) return

    if (type === 'edit' && providerData) {
      const parsed = parseApiConfig(providerData.api_config)
      const values = {
        ...defaultValues,
        title: providerData.title || '',
        token_api: providerData.token_api || '',
        provider_code: providerData.provider_code || '',
        order: providerData.order || '',
        status: providerData.status || 'active',
        rotation_interval: providerData.rotation_interval || '',
        ...parsed,
      }

      reset(values)

      // Tính JSON preview ngay khi load
      const config = buildApiConfig(values as FormValues)
      setJsonPreview(config ? JSON.stringify(config, null, 2) : '// Chưa có cấu hình API')
    } else {
      reset(defaultValues)
      setJsonPreview('// Chưa có cấu hình API')
    }
  }, [open, type, providerData, reset])

  const onSubmit = (data: FormValues) => {
    const apiConfig = buildApiConfig(data)

    const payload: any = {
      title: data.title,
      token_api: data.token_api,
      provider_code: data.provider_code,
      order: Number(data.order) || 0,
      status: data.status,
    }

    if (data.rotation_interval) {
      payload.rotation_interval = Number(data.rotation_interval)
    }

    if (apiConfig) {
      payload.api_config = apiConfig
    }

    const mutation = type === 'create' ? createMutation : updateMutation

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(type === 'create' ? 'Thêm nhà cung cấp thành công!' : 'Cập nhật thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      onClose={onClose}
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth
      maxWidth='xl'
    >
      <DialogTitle>
        <Typography variant='h5' component='span'>
          {type === 'create' ? 'Thêm mới nhà cung cấp' : 'Cập nhật nhà cung cấp'}
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Grid2 container spacing={3}>
          {/* ═══════ BÊN TRÁI: Form fields ═══════ */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ── Thông tin cơ bản ── */}
              <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1, mt: 0.5 }}>Thông tin cơ bản</Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  <Controller
                    name='title'
                    control={control}
                    rules={{ required: 'Bắt buộc' }}
                    render={({ field }) => (
                      <CustomTextField {...field} required fullWidth label='Tên nhà cung cấp' placeholder='VD: ProxyVN, HomeProxy...' error={!!errors.title} helperText={errors.title?.message} />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='provider_code'
                    control={control}
                    rules={{ required: 'Bắt buộc' }}
                    render={({ field }) => (
                      <CustomTextField {...field} required fullWidth label={<>Provider Code <FieldHint text='Mã định danh duy nhất. VD: proxy.vn, homeproxy.vn' /></>} placeholder='proxy.vn' error={!!errors.provider_code} helperText={errors.provider_code?.message} />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='token_api'
                    control={control}
                    rules={{ required: 'Bắt buộc' }}
                    render={({ field }) => (
                      <CustomTextField {...field} required fullWidth label={<>Token API <FieldHint text='API key/token xác thực với nhà cung cấp' /></>} placeholder='Token xác thực' error={!!errors.token_api} helperText={errors.token_api?.message} />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name='status' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label='Trạng thái'>
                      <MenuItem value='active'>Active</MenuItem>
                      <MenuItem value='inactive'>Inactive</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name='order' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth type='number' label='Thứ tự' placeholder='0' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller name='rotation_interval' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth type='number' label={<>Rotation Interval (giây) <FieldHint text='Thời gian chờ giữa 2 lần xoay. VD: 60 = 1 phút' /></>} placeholder='60' />
                  )} />
                </Grid2>
              </Grid2>

              <Divider sx={{ my: 2 }} />

              {/* ── Mua Proxy Xoay ── */}
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography fontWeight={600}>Cấu hình Mua proxy xoay (Rotating)</Typography>
                  <FieldHint text='API mua proxy xoay. Response thường trả key xoay (keyxoay) để dùng cho API xoay sau.' />
                </AccordionSummary>
                <AccordionDetails>
                  <BuyConfigFields prefix='buy_rotating' control={control} />
                </AccordionDetails>
              </Accordion>

              {/* ── Mua Proxy Tĩnh ── */}
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography fontWeight={600}>Cấu hình Mua proxy tĩnh (Static)</Typography>
                  <FieldHint text='API mua proxy tĩnh. Response thường trả trực tiếp ip:port:user:pass.' />
                </AccordionSummary>
                <AccordionDetails>
                  <BuyConfigFields prefix='buy_static' control={control} />
                </AccordionDetails>
              </Accordion>

              {/* ── Cấu hình Xoay ── */}
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography fontWeight={600}>Cấu hình API Xoay proxy</Typography>
                  <FieldHint text='API lấy proxy mới (rotate). Chỉ cần cho proxy rotating.' />
                </AccordionSummary>
                <AccordionDetails>
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

                    {rotateEnabled && (
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
                </AccordionDetails>
              </Accordion>

              {/* ── IP Whitelist ── */}
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography fontWeight={600}>Cấu hình IP Whitelist</Typography>
                  <FieldHint text='Cách truyền IP whitelist cho nhà cung cấp. Bật nếu provider hỗ trợ.' />
                </AccordionSummary>
                <AccordionDetails>
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

                    {ipEnabled && (
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
                </AccordionDetails>
              </Accordion>
            </form>
          </Grid2>

          {/* ═══════ BÊN PHẢI: JSON Preview ═══════ */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 16 }}>
              <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
                api_config (JSON Preview)
              </Typography>
              <Box
                component='pre'
                sx={{
                  bgcolor: 'grey.900',
                  color: '#a5d6a7',
                  p: 2,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  overflow: 'auto',
                  maxHeight: 'calc(100vh - 220px)',
                  fontFamily: '"Fira Code", "Consolas", monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {jsonPreview}
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={isPending}>
          Hủy
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant='contained' disabled={isPending} sx={{ color: '#fff' }}>
          {isPending ? 'Đang xử lý...' : type === 'create' ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
