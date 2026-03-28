'use client'

import { useEffect, useState, useRef } from 'react'

import { useForm, Controller, useWatch, useFieldArray, type Control } from 'react-hook-form'
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
import { ChevronDown, Info, Plus, Trash2 } from 'lucide-react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'

import { useCreateProvider, useUpdateProvider } from '@/hooks/apis/useProviders'

// ─── Types ──────────────────────────────────────────

interface ErrorCodeRule {
  field: string
  value: string
  match: 'exact' | 'contains'
  message: string
}

interface HttpErrorRule {
  status: string
  message: string
}

interface ResponseMappingRule {
  from: string
  to: string
  store: 'proxy' | 'metadata'
}

interface ApiConfigBuyResponse {
  type: string
  success_field: string
  success_value: number | string
  error_message_field: string
  error_codes: ErrorCodeRule[]
  http_errors: HttpErrorRule[]
  fallback_message: string
  proxies_path: string
  proxy_format: string
  proxy_key_field: string
  proxy_fields_ip: string
  proxy_fields_port: string
  proxy_fields_user: string
  proxy_fields_pass: string
  proxy_fields_type: string
  item_id_field: string
  response_mapping: ResponseMappingRule[]
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

interface InheritParam {
  source: 'order' | 'order_item'
  field: string
  param: string
}

interface RenewParamRow {
  param_name: string
  value_type: 'provider_order_code' | 'provider_item_id' | 'duration' | 'custom'
  custom_value: string
}

interface DurationMapRow {
  days: string
  send_value: string
}

interface RenewConfig {
  enabled: boolean
  mode: string
  url: string
  method: string
  auth_type: string
  auth_param: string
  params_rows: RenewParamRow[]
  duration_param: string
  duration_map_rows: DurationMapRow[]
  duration_map_enabled: boolean
  response_mode: string
  success_field: string
  success_value: string
  new_expiry_field: string
  batch_delay_ms: string
  inherit_params: InheritParam[]
}

const SYSTEM_VARS: Record<string, RenewParamRow['value_type']> = {
  '{provider_order_code}': 'provider_order_code',
  '{provider_item_id}': 'provider_item_id',
  '{duration}': 'duration',
}
const VALUE_MAP: Record<string, string> = {
  provider_order_code: '{provider_order_code}',
  provider_item_id: '{provider_item_id}',
  duration: '{duration}',
}
const VALUE_LABELS: Record<string, string> = {
  provider_order_code: 'Mã đơn NCC',
  provider_item_id: 'Mã proxy NCC',
  duration: 'Số ngày gia hạn',
  custom: 'Nhập tự do',
}

function deserializeParamsRows(params: Record<string, string>): RenewParamRow[] {
  return Object.entries(params).map(([param_name, value]) => ({
    param_name,
    value_type: SYSTEM_VARS[value] || 'custom',
    custom_value: SYSTEM_VARS[value] ? '' : String(value),
  }))
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
  renew: RenewConfig
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
    error_message_field: '',
    error_codes: [],
    http_errors: [],
    fallback_message: '',
    proxies_path: 'data.proxies',
    proxy_format: 'key',
    proxy_key_field: 'keyxoay',
    proxy_fields_ip: '', proxy_fields_port: '',
    proxy_fields_user: '', proxy_fields_pass: '', proxy_fields_type: '',
    item_id_field: '',
    response_mapping: [],
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
      error_message_field: buyResp.error_message_field || '',
      error_codes: (buyResp.error_codes || []).map((r: any) => ({
        field: r.field || '',
        value: r.value != null ? String(r.value) : '',
        match: r.match || 'exact',
        message: r.message || '',
      })),
      http_errors: (() => {
        const he = buyResp.http_errors
        if (!he || typeof he !== 'object') return []
        return Object.entries(he).map(([status, message]) => ({ status, message: String(message) }))
      })(),
      fallback_message: buyResp.fallback_message || '',
      proxies_path: (buy.response_mode === 'deferred' ? buyResp.order_id_field : buyResp.proxies_path) || 'data.proxies',
      proxy_format: buyResp.proxy_format || 'key',
      proxy_key_field: buyResp.proxy_key_field || buyResp.proxy_string_field || 'keyxoay',
      proxy_fields_ip: proxyFields.ip || '',
      proxy_fields_port: proxyFields.port || '',
      proxy_fields_user: proxyFields.user || '',
      proxy_fields_pass: proxyFields.pass || '',
      proxy_fields_type: proxyFields.type || '',
      item_id_field: buyResp.item_id_field || '',
      response_mapping: Array.isArray(buyResp.response_mapping)
        ? buyResp.response_mapping.map((r: any) => ({ from: r.from || '', to: r.to || '', store: r.store || 'metadata' }))
        : [],
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
    },
    renew: (() => {
      const r = apiConfig.renew
      if (!r) return { ...defaultValues.renew }
      const resp = r.response || {}
      return {
        enabled: true,
        mode: r.mode || 'by_order',
        url: r.url || '',
        method: r.method || 'POST',
        auth_type: r.auth_type || 'inherit',
        auth_param: r.auth_param || '',
        params_rows: r.params ? deserializeParamsRows(r.params) : [],
        duration_param: r.duration_param || 'days',
        duration_map_rows: r.duration_map ? Object.entries(r.duration_map).map(([days, v]) => ({ days, send_value: String(v) })) : [],
        duration_map_enabled: !!r.duration_map && Object.keys(r.duration_map).length > 0,
        response_mode: r.response_mode || 'immediate',
        success_field: resp.success_field || '',
        success_value: resp.success_value != null ? String(resp.success_value) : '',
        new_expiry_field: resp.new_expiry_field || '',
        batch_delay_ms: r.batch_delay_ms ? String(r.batch_delay_ms) : '0',
        inherit_params: r.inherit_params || [],
      }
    })(),
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
  if (buy.response.error_message_field) resp.error_message_field = buy.response.error_message_field
  if (buy.response.fallback_message) resp.fallback_message = buy.response.fallback_message

  // Error codes mapping
  const validErrorCodes = buy.response.error_codes.filter((r: ErrorCodeRule) => r.field && r.value && r.message)
  if (validErrorCodes.length > 0) {
    resp.error_codes = validErrorCodes.map((r: ErrorCodeRule) => ({
      field: r.field,
      value: r.match === 'contains' ? r.value : (isNaN(Number(r.value)) ? r.value : Number(r.value)),
      match: r.match,
      message: r.message,
    }))
  }

  // HTTP errors mapping (object format: { "524": "message", "5xx": "message" })
  const validHttpErrors = buy.response.http_errors.filter((r: HttpErrorRule) => r.status && r.message)
  if (validHttpErrors.length > 0) {
    resp.http_errors = {} as any
    validHttpErrors.forEach((r: HttpErrorRule) => { resp.http_errors[r.status] = r.message })
  }

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

  // Response mapping: lưu thêm field custom từ NCC response
  const validMapping = buy.response.response_mapping.filter((r: ResponseMappingRule) => r.from && r.to)
  if (validMapping.length > 0) {
    resp.response_mapping = validMapping.map((r: ResponseMappingRule) => ({ from: r.from, to: r.to, store: r.store || 'metadata' }))
  }

  // Deferred: order_id_field thay vì proxy data
  if (buy.response_mode === 'deferred') {
    result.response_mode = 'deferred'
    // Form dùng proxies_path input để nhập order_id path khi deferred
    resp.order_id_field = buy.response.proxies_path || 'data.id'
    delete resp.proxies_path // Deferred không cần proxies_path trong response mua

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

  if (form.renew.enabled && form.renew.url) {
    const r: any = {
      mode: form.renew.mode,
      url: form.renew.url,
      method: form.renew.method,
    }
    if (form.renew.auth_type !== 'inherit') {
      r.auth_type = form.renew.auth_type
      if (form.renew.auth_param) r.auth_param = form.renew.auth_param
    }
    const validParams = (form.renew.params_rows || []).filter((p: RenewParamRow) => p.param_name)
    if (validParams.length > 0) {
      r.params = Object.fromEntries(
        validParams.map((p: RenewParamRow) => [p.param_name, VALUE_MAP[p.value_type] || p.custom_value])
      )
    }
    if (form.renew.duration_param) r.duration_param = form.renew.duration_param
    if (form.renew.duration_map_enabled) {
      const validMap = (form.renew.duration_map_rows || []).filter((d: DurationMapRow) => d.days)
      if (validMap.length > 0) {
        r.duration_map = Object.fromEntries(validMap.map((d: DurationMapRow) => [d.days, d.send_value]))
      }
    }
    if (form.renew.response_mode === 'deferred') r.response_mode = 'deferred'
    if (parseInt(form.renew.batch_delay_ms) > 0) r.batch_delay_ms = parseInt(form.renew.batch_delay_ms)

    const resp: any = {}
    if (form.renew.success_field) resp.success_field = form.renew.success_field
    if (form.renew.success_value !== '') {
      const numVal = Number(form.renew.success_value)
      resp.success_value = isNaN(numVal) ? form.renew.success_value : numVal
    }
    if (form.renew.new_expiry_field) resp.new_expiry_field = form.renew.new_expiry_field
    if (Object.keys(resp).length > 0) r.response = resp

    // Inherit params — kế thừa tham số từ order/order_item
    const validInherit = (form.renew.inherit_params || []).filter(
      (p: InheritParam) => p.field && p.param && ['order', 'order_item'].includes(p.source)
    )
    if (validInherit.length > 0) r.inherit_params = validInherit

    config.renew = r
  }

  return Object.keys(config).length > 0 ? config : null
}

// ─── Response Mapping Table ─────────────────────────

function ResponseMappingRow({ prefix, index, control, onRemove }: { prefix: string; index: number; control: Control<FormValues>; onRemove: () => void }) {
  const store = useWatch({ control, name: `${prefix}.response.response_mapping.${index}.store` as any })
  const isCustomObj = store && !['proxy', 'metadata', 'root'].includes(store) && store !== ''

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
      <Controller name={`${prefix}.response.response_mapping.${index}.from` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Trường NCC (VD: data.region)' sx={{ flex: 1, minWidth: 150 }} />
      )} />
      <Controller name={`${prefix}.response.response_mapping.${index}.to` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Tên field lưu (VD: region)' sx={{ flex: 1, minWidth: 120 }} />
      )} />
      <Controller name={`${prefix}.response.response_mapping.${index}.store` as any} control={control} render={({ field }) => (
        <CustomTextField
          {...field}
          size='small'
          select={!isCustomObj}
          sx={{ minWidth: 180 }}
          placeholder={isCustomObj ? 'Tên object...' : undefined}
          helperText={isCustomObj ? `Lưu vào: ${store}.${'{field}'}` : undefined}
        >
          {!isCustomObj && [
            <MenuItem key='root' value='root'>Cấp 1 (flat trên order_item)</MenuItem>,
            <MenuItem key='proxy' value='proxy'>Trong object proxy</MenuItem>,
            <MenuItem key='metadata' value='metadata'>Trong object metadata</MenuItem>,
            <MenuItem key='_custom' value='_custom'>Object tự đặt tên...</MenuItem>,
          ]}
        </CustomTextField>
      )} />
      {store === '_custom' && (
        <Controller name={`${prefix}.response.response_mapping.${index}.store` as any} control={control} render={({ field }) => (
          <CustomTextField {...field} size='small' placeholder='Tên object (VD: extra_info)' sx={{ minWidth: 140 }}
            onChange={e => { const v = e.target.value; if (v && v !== '_custom') field.onChange(v) }}
          />
        )} />
      )}
      <IconButton size='small' onClick={onRemove} color='error'><Trash2 size={14} /></IconButton>
    </Box>
  )
}

function ResponseMappingTable({ prefix, control }: { prefix: string; control: Control<FormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: `${prefix}.response.response_mapping` as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
        <Typography variant='body2' fontWeight={600}>
          Lưu thêm dữ liệu từ nhà cung cấp (mặc định)
          <FieldHint text='Cấu hình mặc định cho tất cả sản phẩm của nhà cung cấp này. Từng sản phẩm có thể ghi đè riêng trong form sản phẩm.' />
        </Typography>
        <Button size='small' startIcon={<Plus size={14} />} onClick={() => append({ from: '', to: '', store: 'metadata' })}>
          Thêm
        </Button>
      </Box>
      {fields.length === 0 && (
        <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Chưa có. Bấm "Thêm" nếu muốn lưu thêm dữ liệu từ kết quả nhà cung cấp trả về.
        </Typography>
      )}
      {fields.map((f, i) => (
        <ResponseMappingRow key={f.id} prefix={prefix} index={i} control={control} onRemove={() => remove(i)} />
      ))}
    </Grid2>
  )
}

/**
 * Bảng tóm tắt: khi mua proxy, hệ thống lưu gì, lấy từ đâu của NCC.
 * Dùng tiếng Việt hoàn toàn, admin không cần biết code.
 */
function SavePreviewBox({ prefix, control }: { prefix: string; control: Control<FormValues> }) {
  const proxyFormat = useWatch({ control, name: `${prefix}.response.proxy_format` as any })
  const proxyKeyField = useWatch({ control, name: `${prefix}.response.proxy_key_field` as any })
  const proxyFieldsIp = useWatch({ control, name: `${prefix}.response.proxy_fields_ip` as any })
  const proxyFieldsPort = useWatch({ control, name: `${prefix}.response.proxy_fields_port` as any })
  const proxyFieldsUser = useWatch({ control, name: `${prefix}.response.proxy_fields_user` as any })
  const proxyFieldsPass = useWatch({ control, name: `${prefix}.response.proxy_fields_pass` as any })
  const proxyFieldsType = useWatch({ control, name: `${prefix}.response.proxy_fields_type` as any })
  const itemIdField = useWatch({ control, name: `${prefix}.response.item_id_field` as any })
  const responseMode = useWatch({ control, name: `${prefix}.response_mode` as any })
  const responseMapping: any[] = useWatch({ control, name: `${prefix}.response.response_mapping` as any }) || []

  // Build DB preview JSON
  const dbPreview: Record<string, any> = {}
  if (proxyFormat === 'key') {
    dbPreview.provider_key = `← ${proxyKeyField || 'keyxoay'}`
  } else {
    const proxyObj: Record<string, string> = {}
    if (proxyFormat === 'string') {
      const f = proxyKeyField || 'proxy'
      proxyObj.ip = `← ${f}:phần1`
      proxyObj.port = `← ${f}:phần2`
    } else if (proxyFormat === 'fields') {
      proxyObj.ip = `← ${proxyFieldsIp || 'ip'}`
      proxyObj.port = `← ${proxyFieldsPort || 'port'}`
      proxyObj.user = `← ${proxyFieldsUser || 'username'}`
      proxyObj.pass = `← ${proxyFieldsPass || 'password'}`
    }
    // Custom vào proxy
    responseMapping.filter(r => r?.from && r?.to && r?.store === 'proxy').forEach(r => {
      proxyObj[r.to] = `← ${r.from}`
    })
    dbPreview.proxy = proxyObj
  }
  if (itemIdField) dbPreview.provider_item_id = `← ${itemIdField}`

  // Root fields
  const rootFields = responseMapping.filter(r => r?.from && r?.to && r?.store === 'root')
  rootFields.forEach(r => { dbPreview[r.to] = `← ${r.from}` })

  // Metadata
  const metaFields = responseMapping.filter(r => r?.from && r?.to && (r?.store === 'metadata' || !r?.store))
  if (metaFields.length > 0) {
    const metaObj: Record<string, string> = {}
    metaFields.forEach(r => { metaObj[r.to] = `← ${r.from}` })
    dbPreview.metadata = metaObj
  }

  // Custom objects
  const customObjs = responseMapping.filter(r => r?.from && r?.to && r?.store && !['proxy', 'metadata', 'root', '_custom'].includes(r.store))
  const grouped: Record<string, Record<string, string>> = {}
  customObjs.forEach(r => { grouped[r.store] = grouped[r.store] || {}; grouped[r.store][r.to] = `← ${r.from}` })
  Object.entries(grouped).forEach(([name, obj]) => { dbPreview[name] = obj })

  // System fields luôn có
  dbPreview['// hệ thống tự sinh'] = 'key, type, protocol, status, buy_at, expired_at...'

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box sx={{ mt: 1.5, border: '1px solid #bae6fd', borderRadius: 1.5, overflow: 'hidden' }}>
        <Box sx={{ background: '#f0f9ff', px: 1.5, py: 1, borderBottom: '1px solid #bae6fd' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>
            Preview: Cấu trúc dữ liệu order_item trong DB
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#64748b', mt: 0.3 }}>
            Khi mua proxy, mỗi order_item sẽ được lưu trong database với cấu trúc như dưới đây.
          </Typography>
        </Box>
        <pre style={{
          margin: 0, padding: '12px 16px', fontSize: '12px', lineHeight: 1.7,
          fontFamily: 'monospace', color: '#1e293b', background: '#fff',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {JSON.stringify(dbPreview, null, 2)
            .replace(/"← /g, '← "')
            .replace(/"/g, '')
            .replace(/← /g, '← ')
          }
        </pre>
      </Box>
    </Grid2>
  )
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

  const { fields: errorCodeFields, append: appendErrorCode, remove: removeErrorCode } = useFieldArray({
    control,
    name: `${prefix}.response.error_codes` as any,
  })
  const { fields: httpErrorFields, append: appendHttpError, remove: removeHttpError } = useFieldArray({
    control,
    name: `${prefix}.response.http_errors` as any,
  })

  // Helper: box style cho section grouping
  const sectionBox = { p: 1.5, border: '1px solid #e2e8f0', borderRadius: 2, background: '#fafbfc' }
  const sectionTitle = (text: string, hint?: string) => (
    <Typography variant='body2' fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {text} {hint && <FieldHint text={hint} />}
    </Typography>
  )

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
          {/* ═══════════════════════════════════════════════
              SECTION 1: API MUA HÀNG
              ═══════════════════════════════════════════════ */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={sectionBox}>
              {sectionTitle('1. API mua hàng', 'Cấu hình gọi API nhà cung cấp để tạo đơn / mua proxy')}
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name={`${prefix}.method`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label='Method'>
                      <MenuItem value='GET'>GET</MenuItem>
                      <MenuItem value='POST'>POST</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name={`${prefix}.auth_type`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label={<>Xác thực <FieldHint text='query: token qua URL (?key=xxx). header: qua HTTP header. bearer: Authorization: Bearer xxx' /></>}>
                      <MenuItem value='query'>Query param</MenuItem>
                      <MenuItem value='header'>Header</MenuItem>
                      <MenuItem value='bearer'>Bearer token</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name={`${prefix}.auth_param`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={<>Tên param auth <FieldHint text='VD: key, x-api-key, token' /></>} placeholder='key' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name={`${prefix}.quantity_param`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={<>Tên param số lượng <FieldHint text='VD: soluong, quantity, amount' /></>} placeholder='soluong' />
                  )} />
                </Grid2>

                {/* URL */}
                <Grid2 size={{ xs: 12 }}>
                  <Controller
                    name={`${prefix}.use_url_by_duration`}
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <CustomTextField {...field} value={value ? 'duration' : 'single'} onChange={(e) => onChange(e.target.value === 'duration')} fullWidth select
                        label={<>Kiểu URL <FieldHint text='URL đơn: 1 URL cho mọi thời hạn. URL riêng: mỗi thời hạn gọi URL khác nhau.' /></>}
                      >
                        <MenuItem value='single'>1 URL dùng chung</MenuItem>
                        <MenuItem value='duration'>URL riêng theo thời hạn</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>
                {!useUrlByDuration ? (
                  <Grid2 size={{ xs: 12 }}>
                    <Controller name={`${prefix}.url`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='URL' placeholder='https://api.provider.com/buy' />
                    )} />
                  </Grid2>
                ) : (
                  <>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Controller name={`${prefix}.url_1`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='URL — 1 ngày' placeholder='https://...' />
                      )} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Controller name={`${prefix}.url_7`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='URL — 7 ngày' placeholder='https://...' />
                      )} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Controller name={`${prefix}.url_30`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='URL — 30 ngày' placeholder='https://...' />
                      )} />
                    </Grid2>
                  </>
                )}

                {/* Duration param + mapping */}
                <Grid2 size={{ xs: 12, sm: durationParam ? 6 : 12 }}>
                  <Controller name={`${prefix}.duration_param`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={<>Tên param thời hạn <FieldHint text='Param gửi số ngày mua cho provider. VD: thoigian, days, period. Bỏ trống nếu không cần (VD: đã nằm trong URL).' /></>} placeholder='Bỏ trống nếu không cần' />
                  )} />
                </Grid2>
                {durationParam && (
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 1.5, background: '#f1f5f9', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                      <Typography variant='caption' color='text.secondary' sx={{ mb: 1, display: 'block', lineHeight: 1.4 }}>
                        Khi user mua 1/7/30 ngày, hệ thống gửi giá trị nào cho provider?
                        <br />
                        <span style={{ color: '#94a3b8' }}>Bỏ trống = gửi nguyên số ngày. Điền nếu provider dùng giá trị khác (VD: daily, weekly, monthly)</span>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant='caption' sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>1 ngày</Typography>
                          <Controller name={`${prefix}.duration_map_1`} control={control} render={({ field }) => (
                            <CustomTextField {...field} fullWidth placeholder='1' size='small' sx={{ '& input': { textAlign: 'center' } }} />
                          )} />
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant='caption' sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>7 ngày</Typography>
                          <Controller name={`${prefix}.duration_map_7`} control={control} render={({ field }) => (
                            <CustomTextField {...field} fullWidth placeholder='7' size='small' sx={{ '& input': { textAlign: 'center' } }} />
                          )} />
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant='caption' sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>30 ngày</Typography>
                          <Controller name={`${prefix}.duration_map_30`} control={control} render={({ field }) => (
                            <CustomTextField {...field} fullWidth placeholder='30' size='small' sx={{ '& input': { textAlign: 'center' } }} />
                          )} />
                        </Box>
                      </Box>
                    </Box>
                  </Grid2>
                )}

                {/* Params mặc định */}
                <Grid2 size={{ xs: 12 }}>
                  <Controller name={`${prefix}.params_json`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={<>Params cố định (JSON) <FieldHint text='Các param luôn gửi kèm. VD: {"loaiproxy":"static","quocgia":"us"}. Bỏ trống nếu không có.' /></>} placeholder='{"key1":"value1"}' />
                  )} />
                </Grid2>

                {/* Double ampersand — hiếm, ẩn trong 1 dòng nhỏ */}
                <Grid2 size={{ xs: 12 }}>
                  <Controller name={`${prefix}.double_ampersand`} control={control} render={({ field: { value, onChange, ...field } }) => (
                    <CustomTextField {...field} value={value ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} fullWidth select size='small'
                      label={<>Dấu nối params <FieldHint text='Mặc định dùng & nối params (?a=1&b=2). Một số API hiếm dùng && thay vì &.' /></>}
                    >
                      <MenuItem value='false'>Bình thường (&)</MenuItem>
                      <MenuItem value='true'>Double (&&)</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>

          {/* ═══════════════════════════════════════════════
              SECTION 2: KẾT QUẢ TRẢ VỀ
              ═══════════════════════════════════════════════ */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={sectionBox}>
              {sectionTitle('2. Đọc kết quả từ nhà cung cấp')}
              <Grid2 container spacing={2}>
                {/* Giải thích tổng quan */}
                <Grid2 size={{ xs: 12 }}>
                  <Box sx={{ p: 1.5, background: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    Sau khi gọi API mua, nhà cung cấp sẽ <strong>trả về kết quả</strong>. Có 2 dạng:
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 240 }}>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#334155', mb: 0.5 }}>Dạng 1: 1 kết quả duy nhất</Typography>
                        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 10, borderRadius: 6, margin: 0, fontSize: 11, overflowX: 'auto', lineHeight: 1.5 }}>{responseMode === 'deferred'
? `{
  "success": true,       ← Check: "success" = true
  "data": {
    "id": 12345          ← Mã đơn: "data.id"
  }
}`
: `{
  "success": true,       ← Check: "success" = true
  "data": {
    "proxies": [         ← Proxy: "data.proxies"
      {"ip":"1.2.3.4", ...}
    ]
  }
}`}</pre>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 240 }}>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#334155', mb: 0.5 }}>Dạng 2: Nhiều kết quả liên tiếp</Typography>
                        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 10, borderRadius: 6, margin: 0, fontSize: 11, overflowX: 'auto', lineHeight: 1.5 }}>{`{                        ← Proxy 1
  "status": 100,
  "ip": "27.73.88.211",
  "port": 35270, ...
},
{                        ← Kết quả cuối
  "status": 200,         ← Check: "status" = 200
  "comen": "Success"
}`}</pre>
                      </Box>
                    </Box>
                    Chọn dạng phù hợp rồi cấu hình bên dưới.
                  </Box>
                </Grid2>

                {/* Response mode */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name={`${prefix}.response_mode`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label='Nhà cung cấp trả về gì?'>
                      <MenuItem value='immediate'>Trả proxy ngay</MenuItem>
                      <MenuItem value='deferred'>Chỉ trả mã đơn, lấy proxy sau</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>

                {/* Check thành công */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name={`${prefix}.response.type`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select
                      label='Dạng kết quả trả về'
                      helperText='Gọi thử API đối tác, xem kết quả rồi chọn dạng phù hợp'
                    >
                      <MenuItem value='object'>Dạng 1 — Chỉ có 1 cặp {'{ }'} duy nhất</MenuItem>
                      <MenuItem value='array_last_status'>Dạng 2 — Có nhiều cặp {'{ }'} liên tiếp (bao bởi [ ])</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
                  <Controller name={`${prefix}.response.success_field`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label={<>Tên field kiểm tra <FieldHint text='Tên trường dùng để biết thành công/thất bại. VD: statusCode, success, status' /></>} placeholder='statusCode' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 3, sm: 1.5 }}>
                  <Controller name={`${prefix}.response.success_value`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='200' />
                  )} />
                </Grid2>

                {/* Field chứa message lỗi từ provider */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name={`${prefix}.response.error_message_field`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth
                      label={<>Field chứa lý do lỗi <FieldHint text={'VD: đối tác trả {"statusCode":101, "message":"Hết hàng"}\n→ điền "message"\n→ hệ thống tự hiện "Hết hàng" khi có lỗi\n\nNên luôn điền field này.'} /></>}
                      placeholder='message'
                      helperText='Thay thế cho mã lỗi, hoặc dùng khi gặp mã lỗi chưa có trong danh sách bên dưới'
                    />
                  )} />
                </Grid2>

                {/* Error codes mapping */}
                <Grid2 size={{ xs: 12 }}>
                  <Box sx={{ p: 1.5, background: '#fef2f2', borderRadius: 1.5, border: '1px solid #fecaca' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant='caption' sx={{ fontWeight: 600, color: '#991b1b' }}>
                        Mã lỗi cụ thể <FieldHint text='Khi nhà cung cấp trả mã lỗi, hệ thống sẽ hiện thông báo tương ứng thay vì lỗi chung chung.' />
                      </Typography>
                      <Button
                        size='small'
                        startIcon={<Plus size={14} />}
                        onClick={() => appendErrorCode({ field: '', value: '', match: 'exact' as const, message: '' })}
                        sx={{ fontSize: 11, textTransform: 'none' }}
                      >
                        Thêm mã lỗi
                      </Button>
                    </Box>

                    {errorCodeFields.map((item, idx) => (
                      <Box key={item.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                        <Controller name={`${prefix}.response.error_codes.${idx}.field`} control={control} render={({ field }) => (
                          <CustomTextField {...field} placeholder='statusCode' size='small' sx={{ flex: 1.2 }} label={idx === 0 ? 'Field' : undefined} />
                        )} />
                        <Controller name={`${prefix}.response.error_codes.${idx}.match`} control={control} render={({ field }) => (
                          <CustomTextField {...field} select size='small' sx={{ flex: 1 }} label={idx === 0 ? 'So sánh' : undefined}>
                            <MenuItem value='exact'>bằng (===)</MenuItem>
                            <MenuItem value='contains'>chứa</MenuItem>
                          </CustomTextField>
                        )} />
                        <Controller name={`${prefix}.response.error_codes.${idx}.value`} control={control} render={({ field }) => (
                          <CustomTextField {...field} placeholder='101' size='small' sx={{ flex: 1 }} label={idx === 0 ? 'Giá trị' : undefined} />
                        )} />
                        <Controller name={`${prefix}.response.error_codes.${idx}.message`} control={control} render={({ field }) => (
                          <CustomTextField {...field} placeholder='Hết proxy trong kho' size='small' sx={{ flex: 2 }} label={idx === 0 ? 'Thông báo hiển thị' : undefined} />
                        )} />
                        <IconButton
                          size='small'
                          onClick={() => removeErrorCode(idx)}
                          sx={{ color: '#dc2626', mt: idx === 0 ? 2.5 : 0 }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    ))}

                    {errorCodeFields.length === 0 && (
                      <Typography variant='caption' sx={{ color: '#a8a29e', fontStyle: 'italic' }}>
                        Chưa có mã lỗi nào. Bấm "Thêm mã lỗi" để cấu hình.
                      </Typography>
                    )}
                  </Box>
                </Grid2>

                {/* HTTP errors — lỗi khi API trả HTML thay vì JSON */}
                <Grid2 size={{ xs: 12 }}>
                  <Box sx={{ p: 1.5, background: '#fefce8', borderRadius: 1.5, border: '1px solid #fde68a' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant='caption' sx={{ fontWeight: 600, color: '#854d0e' }}>
                        Lỗi HTTP (server/mạng) <FieldHint text='Khi nhà cung cấp trả lỗi HTTP (500, 524...) thay vì JSON bình thường. Hệ thống sẽ hiện thông báo bạn cấu hình thay vì hiện HTML rác.' />
                      </Typography>
                      <Button
                        size='small'
                        startIcon={<Plus size={14} />}
                        onClick={() => appendHttpError({ status: '', message: '' })}
                        sx={{ fontSize: 11, textTransform: 'none' }}
                      >
                        Thêm mã HTTP
                      </Button>
                    </Box>

                    {httpErrorFields.map((item, idx) => (
                      <Box key={item.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                        <Controller name={`${prefix}.response.http_errors.${idx}.status`} control={control} render={({ field }) => (
                          <CustomTextField {...field} placeholder='524 hoặc 5xx' size='small' sx={{ flex: 1 }} label={idx === 0 ? 'Mã HTTP' : undefined}
                            helperText={idx === 0 ? 'VD: 524, 429, 5xx, 4xx' : undefined}
                          />
                        )} />
                        <Controller name={`${prefix}.response.http_errors.${idx}.message`} control={control} render={({ field }) => (
                          <CustomTextField {...field} placeholder='Server nhà cung cấp đang lỗi' size='small' sx={{ flex: 3 }} label={idx === 0 ? 'Thông báo hiển thị' : undefined} />
                        )} />
                        <IconButton
                          size='small'
                          onClick={() => removeHttpError(idx)}
                          sx={{ color: '#dc2626', mt: idx === 0 ? 2.5 : 0 }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    ))}

                    {httpErrorFields.length === 0 && (
                      <Typography variant='caption' sx={{ color: '#a8a29e', fontStyle: 'italic' }}>
                        Không bắt buộc. Hệ thống sẽ tự trích nội dung từ HTML nếu chưa cấu hình.
                      </Typography>
                    )}
                  </Box>
                </Grid2>

                {/* Fallback message */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller name={`${prefix}.response.fallback_message`} control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth
                      label={<>Thông báo mặc định khi lỗi <FieldHint text='Hiển thị khi có lỗi nhưng không khớp mã lỗi nào ở trên và không lấy được message từ provider' /></>}
                      placeholder='Lỗi không xác định từ nhà cung cấp'
                      helperText='Bỏ trống = hiện message mặc định hệ thống'
                    />
                  )} />
                </Grid2>

                {/* ── IMMEDIATE MODE: proxy data trong response ── */}
                {responseMode !== 'deferred' && (
                  <>
                    {responseType === 'object' && (
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Controller name={`${prefix}.response.proxies_path`} control={control} render={({ field }) => (
                          <CustomTextField {...field} fullWidth label='Vị trí danh sách proxy' helperText='Lấy tên trường từ kết quả API, xem ví dụ ở trên' placeholder='data.proxies' />
                        )} />
                      </Grid2>
                    )}
                    <Grid2 size={{ xs: 12, sm: responseType === 'object' ? 6 : 4 }}>
                      <Controller name={`${prefix}.response.proxy_format`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth select label={<>Format mỗi proxy <FieldHint text='Mỗi phần tử trong mảng proxy có dạng gì?' /></>}>
                          <MenuItem value='key'>1 field key (VD: keyxoay)</MenuItem>
                          <MenuItem value='string'>Chuỗi ip:port:user:pass</MenuItem>
                          <MenuItem value='fields'>Nhiều field riêng (ip, port, user, pass)</MenuItem>
                        </CustomTextField>
                      )} />
                    </Grid2>

                    {proxyFormat === 'key' && (
                      <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Controller name={`${prefix}.response.proxy_key_field`} control={control} render={({ field }) => (
                          <CustomTextField {...field} fullWidth label='Tên field key' placeholder='keyxoay' />
                        )} />
                      </Grid2>
                    )}
                    {proxyFormat === 'string' && (
                      <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Controller name={`${prefix}.response.proxy_key_field`} control={control} render={({ field }) => (
                          <CustomTextField {...field} fullWidth label='Tên field chuỗi proxy' placeholder='proxy' />
                        )} />
                      </Grid2>
                    )}
                    {proxyFormat === 'fields' && (
                      <>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.proxy_fields_ip`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Field IP' placeholder='ip' />)} /></Grid2>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.proxy_fields_port`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Field Port' placeholder='port' />)} /></Grid2>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.proxy_fields_user`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Field User' placeholder='username' />)} /></Grid2>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.proxy_fields_pass`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Field Pass' placeholder='password' />)} /></Grid2>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.proxy_fields_type`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Field Type' placeholder='type' />)} /></Grid2>
                        <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.response.item_id_field`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label={<>Field ID <FieldHint text='ID proxy từ provider. Bỏ trống nếu không có.' /></>} placeholder='id' />)} /></Grid2>
                      </>
                    )}
                    {proxyFormat === 'string' && (
                      <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Controller name={`${prefix}.response.item_id_field`} control={control} render={({ field }) => (
                          <CustomTextField {...field} fullWidth label={<>Field ID proxy <FieldHint text='Bỏ trống nếu không có' /></>} placeholder='id' />
                        )} />
                      </Grid2>
                    )}
                  </>
                )}

                {/* ── DEFERRED MODE: mã đơn hàng trong response ── */}
                {responseMode === 'deferred' && (
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Controller name={`${prefix}.response.proxies_path`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Vị trí mã đơn hàng' helperText='Lấy tên trường từ kết quả API, xem ví dụ ở trên' placeholder='data.id' />
                    )} />
                  </Grid2>
                )}
              </Grid2>
            </Box>
          </Grid2>

          {/* ═══════════════════════════════════════════════
              SECTION 3: API LẤY PROXY (chỉ deferred)
              ═══════════════════════════════════════════════ */}
          {responseMode === 'deferred' && (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ ...sectionBox, background: '#fffdf5', borderColor: '#fde68a' }}>
                {sectionTitle('3. API lấy proxy (poll tự động)', 'Sau khi có mã đơn, hệ thống gọi API này mỗi phút để lấy proxy')}
                <Grid2 container spacing={2}>
                  {/* Ví dụ response */}
                  <Grid2 size={{ xs: 12 }}>
                    <Box sx={{ p: 1.5, background: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                      <strong>Hướng dẫn đọc kết quả API:</strong>
                      <Box sx={{ mt: 1, mb: 1, p: 1.5, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#0c4a6e', mb: 1 }}>
                          Bước 1: Gọi thử API lấy proxy → nhà cung cấp trả về kết quả (gọi là "response")
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: '#334155', mb: 0.5 }}>
                          Ví dụ đây là <strong>toàn bộ response</strong> mà nhà cung cấp trả về:
                        </Typography>
                        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 10, borderRadius: 6, margin: '4px 0', fontSize: 11, overflowX: 'auto', lineHeight: 1.7 }}>{`┌─ Đây là toàn bộ response ──────────────────────────┐
│                                                     │
│  {                                                  │
│    "success": true,                                 │
│    "data": {                                        │
│       ▲                                             │
│       └── Đây là TÊN TRƯỜNG (nằm bên trái dấu :)  │
│                                                     │
│      "proxies": [                                   │
│         ▲                                           │
│         └── Đây cũng là TÊN TRƯỜNG                 │
│                                                     │
│        {"ip":"1.2.3.4", "port":8080, ...},          │
│        {"ip":"5.6.7.8", "port":3128, ...}           │
│           ▲                                         │
│           └── Đây là DANH SÁCH PROXY cần lấy       │
│      ]                                              │
│    }                                                │
│  }                                                  │
│                                                     │
└─────────────────────────────────────────────────────┘`}</pre>

                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#0c4a6e', mt: 1.5, mb: 1 }}>
                          Bước 2: Tìm đường đi đến danh sách proxy
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: '#334155', lineHeight: 1.8 }}>
                          Từ ngoài vào trong, danh sách proxy nằm trong <strong>"data"</strong> rồi trong <strong>"proxies"</strong>
                          <br />→ Nối tên các trường bằng dấu chấm: <strong style={{ color: '#16a34a' }}>data.proxies</strong>
                        </Typography>

                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#0c4a6e', mt: 1.5, mb: 0.5 }}>
                          Thêm ví dụ:
                        </Typography>
                        <Box sx={{ fontSize: 11.5, color: '#334155', lineHeight: 1.8, pl: 1 }}>
                          • NCC trả <code style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>{`{"result": [...]}`}</code> → proxy nằm trong "result" → điền: <strong style={{ color: '#16a34a' }}>result</strong>
                          <br />
                          • NCC trả <code style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>{`{"data": {"data": [...]}}`}</code> → "data" rồi "data" → điền: <strong style={{ color: '#16a34a' }}>data.data</strong>
                          <br />
                          • NCC trả <code style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>{`{"response": {"items": [...]}}`}</code> → "response" rồi "items" → điền: <strong style={{ color: '#16a34a' }}>response.items</strong>
                        </Box>
                        <Typography sx={{ fontSize: 11, color: '#64748b', mt: 1, fontStyle: 'italic' }}>
                          Lưu ý: Tên trường do mỗi nhà cung cấp tự đặt, không giống nhau. Phải xem kết quả API thực tế của từng NCC.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Controller name={`${prefix}.fetch_proxies.url`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth
                        label='URL lấy proxy'
                        helperText='Dùng {order_id} thay cho mã đơn hàng'
                        placeholder='https://api.provider.com/orders/{order_id}/proxies' />
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
                      <CustomTextField {...field} fullWidth select label='Xác thực'>
                        <MenuItem value='inherit'>Giống API mua</MenuItem>
                        <MenuItem value='query'>Query param</MenuItem>
                        <MenuItem value='header'>Header</MenuItem>
                        <MenuItem value='bearer'>Bearer token</MenuItem>
                      </CustomTextField>
                    )} />
                  </Grid2>

                  {/* Check thành công + vị trí proxy */}
                  <Grid2 size={{ xs: 6, sm: 2.5 }}>
                    <Controller name={`${prefix}.fetch_proxies.success_field`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth
                        label='Tên field kiểm tra'
                        helperText='Bỏ trống nếu không cần'
                        placeholder='success' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 1.5 }}>
                    <Controller name={`${prefix}.fetch_proxies.success_value`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='true' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxies_path`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth
                        label='Vị trí danh sách proxy'
                        helperText='Lấy tên trường từ kết quả API, xem ví dụ ở trên'
                        placeholder='data.proxies' />
                    )} />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Controller name={`${prefix}.fetch_proxies.proxy_format`} control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Format proxy'>
                        <MenuItem value='key'>1 field key</MenuItem>
                        <MenuItem value='string'>Chuỗi ip:port:user:pass</MenuItem>
                        <MenuItem value='fields'>Nhiều field riêng</MenuItem>
                      </CustomTextField>
                    )} />
                  </Grid2>

                  {fetchProxyFormat === 'fields' && (
                    <>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.proxy_fields_ip`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='IP' placeholder='ip' />)} /></Grid2>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.proxy_fields_port`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Port' placeholder='port' />)} /></Grid2>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.proxy_fields_user`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='User' placeholder='user' />)} /></Grid2>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.proxy_fields_pass`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Pass' placeholder='pass' />)} /></Grid2>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.proxy_fields_type`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='Type' placeholder='type' />)} /></Grid2>
                      <Grid2 size={{ xs: 4, sm: 2 }}><Controller name={`${prefix}.fetch_proxies.item_id_field`} control={control} render={({ field }) => (<CustomTextField {...field} fullWidth label='ID' placeholder='id' />)} /></Grid2>
                    </>
                  )}
                  {(fetchProxyFormat === 'key' || fetchProxyFormat === 'string') && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Controller name={`${prefix}.fetch_proxies.proxy_key_field`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label={fetchProxyFormat === 'key' ? 'Tên field key' : 'Tên field chuỗi proxy'} placeholder={fetchProxyFormat === 'key' ? 'keyxoay' : 'proxy'} />
                      )} />
                    </Grid2>
                  )}

                  {/* Pagination */}
                  <Grid2 size={{ xs: 12 }}>
                    <Divider sx={{ my: 0.5 }} />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Controller name={`${prefix}.fetch_proxies.pagination_enabled`} control={control} render={({ field: { value, onChange, ...field } }) => (
                      <CustomTextField {...field} value={value ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} fullWidth select
                        label={<>Phân trang <FieldHint text='Bật nếu API trả proxy phân trang (nhiều page). Hệ thống sẽ tự gom hết.' /></>}
                      >
                        <MenuItem value='false'>Không</MenuItem>
                        <MenuItem value='true'>Có phân trang</MenuItem>
                      </CustomTextField>
                    )} />
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
                          <CustomTextField {...field} fullWidth label={<>Path last page <FieldHint text='VD: data.last_page, meta.last_page' /></>} placeholder='data.last_page' />
                        )} />
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </Box>
            </Grid2>
          )}

          {/* ═══════════════════════════════════════════════
              SECTION: DỮ LIỆU LƯU TRỮ
              ═══════════════════════════════════════════════ */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ ...sectionBox, background: '#f0f9ff', borderColor: '#93c5fd' }}>
              {sectionTitle(
                responseMode === 'deferred' ? '4. Dữ liệu hệ thống lưu khi mua' : '3. Dữ liệu hệ thống lưu khi mua',
                'Bảng ánh xạ: hệ thống lấy gì từ kết quả nhà cung cấp trả về. Đây là cấu hình mặc định — từng sản phẩm có thể ghi đè riêng.'
              )}
              <Grid2 container spacing={2}>
                <ResponseMappingTable prefix={prefix} control={control} />
                <SavePreviewBox prefix={prefix} control={control} />
              </Grid2>
            </Box>
          </Grid2>

          {/* ═══════════════════════════════════════════════
              SECTION: TUỲ CHỌN NÂNG CAO
              ═══════════════════════════════════════════════ */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={sectionBox}>
              {sectionTitle(responseMode === 'deferred' ? '5. Tuỳ chọn nâng cao' : '4. Tuỳ chọn nâng cao')}
              <Grid2 container spacing={2}>
                {/* User override */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name={`${prefix}.user_override_enabled`} control={control} render={({ field: { value, onChange, ...field } }) => (
                    <CustomTextField {...field} value={value ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} fullWidth select
                      label={<>User tự chọn User:Pass <FieldHint text='Bật nếu provider cho phép user tự đặt tài khoản proxy' /></>}
                    >
                      <MenuItem value='false'>Không</MenuItem>
                      <MenuItem value='true'>Có</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                {userOverrideEnabled && (
                  <>
                    <Grid2 size={{ xs: 6, sm: 4 }}>
                      <Controller name={`${prefix}.user_override_user_param`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='Param username' placeholder='user' />
                      )} />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 4 }}>
                      <Controller name={`${prefix}.user_override_pass_param`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='Param password' placeholder='password' />
                      )} />
                    </Grid2>
                  </>
                )}

                {/* Protocol override */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name={`${prefix}.protocol_override_enabled`} control={control} render={({ field: { value, onChange, ...field } }) => (
                    <CustomTextField {...field} value={value ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} fullWidth select
                      label={<>Giao thức (HTTP/SOCKS5) <FieldHint text='Khi khách chọn HTTP hoặc SOCKS5, hệ thống sẽ gửi giá trị tương ứng cho nhà cung cấp qua tên biến bên dưới. Bỏ "type" trong Params mặc định nếu bật.' /></>}
                    >
                      <MenuItem value='false'>Không gửi</MenuItem>
                      <MenuItem value='true'>Gửi theo lựa chọn khách</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
                {protocolOverrideEnabled && (
                  <>
                    <Grid2 size={{ xs: 4, sm: 2.67 }}>
                      <Controller name={`${prefix}.protocol_override_param`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label={<>Tên biến <FieldHint text='Tên biến gửi cho NCC. VD: type, protocol' /></>} placeholder='type' />
                      )} />
                    </Grid2>
                    <Grid2 size={{ xs: 4, sm: 2.67 }}>
                      <Controller name={`${prefix}.protocol_override_http`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label={<>Khi chọn HTTP <FieldHint text='Giá trị gửi cho NCC khi khách chọn HTTP. VD: HTTP, http' /></>} placeholder='HTTP' />
                      )} />
                    </Grid2>
                    <Grid2 size={{ xs: 4, sm: 2.67 }}>
                      <Controller name={`${prefix}.protocol_override_socks5`} control={control} render={({ field }) => (
                        <CustomTextField {...field} fullWidth label={<>Khi chọn SOCKS5 <FieldHint text='Giá trị gửi cho NCC khi khách chọn SOCKS5. VD: SOCKS5, socks5' /></>} placeholder='SOCKS5' />
                      )} />
                    </Grid2>
                  </>
                )}
              </Grid2>
            </Box>
          </Grid2>
        </>
      )}
    </Grid2>
  )
}

// ─── Inherit Params Table ────────────────────────────

const ORDER_FIELDS = [
  { value: 'order_code', label: 'Mã đơn hàng' },
  { value: 'quantity', label: 'Số lượng' },
  { value: 'time', label: 'Thời hạn gốc (ngày)' },
  { value: 'country', label: 'Quốc gia' },
  { value: 'protocol', label: 'Giao thức' },
  { value: 'ip_version', label: 'IP version' },
  { value: 'proxy_type', label: 'Loại proxy' },
]

const ITEM_FIELDS = [
  { value: 'provider_order_code', label: 'Mã đơn NCC' },
  { value: 'provider_item_id', label: 'ID proxy NCC' },
  { value: 'proxy.ip', label: 'IP' },
  { value: 'proxy.port', label: 'Port' },
  { value: 'proxy.username', label: 'Username' },
  { value: 'proxy.password', label: 'Password' },
  { value: 'proxy.loaiproxy', label: 'Loại proxy (loaiproxy)' },
  { value: 'proxy.http', label: 'Proxy HTTP string' },
  { value: 'proxy.socks5', label: 'Proxy SOCKS5 string' },
  { value: 'key', label: 'Key hệ thống' },
  { value: 'protocol', label: 'Giao thức (HTTP/SOCKS5)' },
]

/** Tham số gửi NCC — bảng trực quan thay JSON */
function RenewParamsTable({ control }: { control: Control<FormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.params_rows' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body2' fontWeight={600}>Tham số gửi NCC</Typography>
        <Button size='small' startIcon={<Plus size={14} />}
          onClick={() => append({ param_name: '', value_type: 'custom', custom_value: '' })}>
          Thêm
        </Button>
      </Box>
      {fields.length === 0 && (
        <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Chưa có tham số. Bấm "Thêm" nếu NCC cần gửi kèm dữ liệu.
        </Typography>
      )}
      {fields.map((f, i) => (
        <RenewParamRow key={f.id} index={i} control={control} onRemove={() => remove(i)} />
      ))}
    </Grid2>
  )
}

function RenewParamRow({ index, control, onRemove }: { index: number; control: Control<FormValues>; onRemove: () => void }) {
  const valueType = useWatch({ control, name: `renew.params_rows.${index}.value_type` as any })

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
      <Controller name={`renew.params_rows.${index}.param_name` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Tên param (VD: order_id)' sx={{ flex: 1 }} />
      )} />
      <Controller name={`renew.params_rows.${index}.value_type` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' select sx={{ minWidth: 170 }}>
          {Object.entries(VALUE_LABELS).map(([k, v]) => (
            <MenuItem key={k} value={k}>{v}</MenuItem>
          ))}
        </CustomTextField>
      )} />
      {valueType === 'custom' && (
        <Controller name={`renew.params_rows.${index}.custom_value` as any} control={control} render={({ field }) => (
          <CustomTextField {...field} size='small' placeholder='Giá trị' sx={{ flex: 1 }} />
        )} />
      )}
      <IconButton size='small' onClick={onRemove} color='error'><Trash2 size={14} /></IconButton>
    </Box>
  )
}

/** Quy đổi thời hạn — ẩn mặc định, bật khi NCC dùng tên thay số ngày */
function DurationMapSection({ control }: { control: Control<FormValues> }) {
  const enabled = useWatch({ control, name: 'renew.duration_map_enabled' as any })
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.duration_map_rows' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Controller name='renew.duration_map_enabled' control={control} render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={!!field.value} size='small' />}
          label={<Typography variant='body2'>NCC dùng tên thay số ngày (VD: weekly, monthly)</Typography>}
        />
      )} />
      {enabled && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant='caption' color='text.secondary'>Quy đổi: số ngày → giá trị gửi NCC</Typography>
            <Button size='small' startIcon={<Plus size={14} />}
              onClick={() => append({ days: '', send_value: '' })}>
              Thêm
            </Button>
          </Box>
          {fields.map((f, i) => (
            <Box key={f.id} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
              <Controller name={`renew.duration_map_rows.${i}.days` as any} control={control} render={({ field }) => (
                <CustomTextField {...field} size='small' placeholder='Số ngày (VD: 7)' sx={{ width: 120 }} />
              )} />
              <Typography variant='body2' color='text.secondary'>→</Typography>
              <Controller name={`renew.duration_map_rows.${i}.send_value` as any} control={control} render={({ field }) => (
                <CustomTextField {...field} size='small' placeholder='Gửi NCC (VD: weekly)' sx={{ flex: 1 }} />
              )} />
              <IconButton size='small' onClick={() => remove(i)} color='error'><Trash2 size={14} /></IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Grid2>
  )
}

function InheritParamsTable({ control }: { control: Control<FormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.inherit_params' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body2' fontWeight={600}>
          Lấy thông tin từ đơn hàng gốc
        </Typography>
        <Button size='small' onClick={() => append({ source: 'order', field: '', param: '' })}>
          + Thêm
        </Button>
      </Box>
      {fields.map((f, i) => (
        <InheritParamRow key={f.id} control={control} index={i} onRemove={() => remove(i)} />
      ))}
      {fields.length === 0 && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontStyle: 'italic' }}>
          NCC chỉ cần mã đơn/mã proxy/số ngày — không cần thêm thông tin khác.
        </Typography>
      )}
    </Grid2>
  )
}

function InheritParamRow({ control, index, onRemove }: { control: Control<FormValues>, index: number, onRemove: () => void }) {
  const source = useWatch({ control, name: `renew.inherit_params.${index}.source` as any })
  const fieldOptions = source === 'order_item' ? ITEM_FIELDS : ORDER_FIELDS

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
      <Controller name={`renew.inherit_params.${index}.source` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} select size='small' sx={{ minWidth: 130 }} label='Lấy từ'>
          <MenuItem value='order'>Đơn hàng</MenuItem>
          <MenuItem value='order_item'>Proxy</MenuItem>
        </CustomTextField>
      )} />
      <Controller name={`renew.inherit_params.${index}.field` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} select size='small' sx={{ minWidth: 160 }} label='Thông tin cần lấy'>
          {fieldOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          <MenuItem value='__custom'>Tự nhập...</MenuItem>
        </CustomTextField>
      )} />
      {useWatch({ control, name: `renew.inherit_params.${index}.field` as any }) === '__custom' && (
        <Controller name={`renew.inherit_params.${index}.field` as any} control={control} render={({ field }) => (
          <CustomTextField {...field} size='small' sx={{ minWidth: 120 }} label='Field' placeholder='metadata.xxx' />
        )} />
      )}
      <Controller name={`renew.inherit_params.${index}.param` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' sx={{ minWidth: 130 }} label='NCC gọi là gì?' placeholder='country_code' />
      )} />
      <IconButton size='small' onClick={onRemove} color='error'><i className='tabler-trash' /></IconButton>
    </Box>
  )
}

// ─── Renew Config Fields ────────────────────────────

function RenewConfigFields({ control }: { control: Control<FormValues> }) {
  const enabled = useWatch({ control, name: 'renew.enabled' })
  const mode = useWatch({ control, name: 'renew.mode' })
  const renewAuthType = useWatch({ control, name: 'renew.auth_type' })

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Controller
          name='renew.enabled'
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <CustomTextField
              {...field}
              value={value ? 'true' : 'false'}
              onChange={(e) => onChange(e.target.value === 'true')}
              fullWidth select label='Hỗ trợ gia hạn'
            >
              <MenuItem value='false'>Tắt</MenuItem>
              <MenuItem value='true'>Bật</MenuItem>
            </CustomTextField>
          )}
        />
      </Grid2>

      {enabled && (
        <>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.mode' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Cách gia hạn'>
                <MenuItem value='by_order'>1 lệnh cho cả đơn</MenuItem>
                <MenuItem value='by_item'>Gọi riêng từng proxy</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.method' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Method'>
                <MenuItem value='GET'>GET</MenuItem>
                <MenuItem value='POST'>POST</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.auth_type' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Xác thực NCC'>
                <MenuItem value='inherit'>Giống lúc mua</MenuItem>
                <MenuItem value='query'>Key trong URL (?key=xxx)</MenuItem>
                <MenuItem value='header'>Key trong header</MenuItem>
                <MenuItem value='bearer'>Bearer token</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>

          {renewAuthType && renewAuthType !== 'inherit' && renewAuthType !== 'bearer' && (
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Controller name='renew.auth_param' control={control} render={({ field }) => (
                <CustomTextField {...field} fullWidth
                  label='NCC gọi tên key là gì?'
                  placeholder={renewAuthType === 'header' ? 'apikey' : 'key'}
                />
              )} />
            </Grid2>
          )}

          <Grid2 size={{ xs: 12 }}>
            <Controller name='renew.url' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth
                label='URL gia hạn'
                placeholder='https://api.ncc.com/renew/{provider_order_code}'
                helperText={
                  field.value?.includes('{')
                    ? '↳ ' + field.value
                        .replace(/\{provider_order_code\}/g, 'TXN-12345')
                        .replace(/\{provider_item_id\}/g, 'PROXY-001')
                        .replace(/\{duration\}/g, '30')
                    : 'Dùng {provider_order_code} = mã đơn NCC, {provider_item_id} = mã proxy, {duration} = số ngày'
                }
              />
            )} />
          </Grid2>

          {/* Tham số gửi NCC — visual table */}
          <RenewParamsTable control={control} />

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.duration_param' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='NCC gọi "số ngày" là gì?' placeholder='days' helperText='Tên tham số gửi số ngày. VD: days, duration, period' />
            )} />
          </Grid2>

          {/* Quy đổi thời hạn — ẩn mặc định */}
          <DurationMapSection control={control} />

          {mode === 'by_item' && (
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Controller name='renew.batch_delay_ms' control={control} render={({ field }) => (
                <CustomTextField {...field} fullWidth type='number' label='Nghỉ giữa mỗi proxy (ms)' placeholder='0' helperText='Nếu NCC giới hạn tốc độ gọi. 0 = không nghỉ' />
              )} />
            </Grid2>
          )}

          {/* Inherit params */}
          <InheritParamsTable control={control} />

          {/* Response */}
          <Grid2 size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              NCC trả về thế nào khi thành công?
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='renew.success_field' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field báo OK' placeholder='status' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='renew.success_value' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='success' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller name='renew.new_expiry_field' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field ngày hết hạn mới' placeholder='data.expired_at' helperText='Bỏ trống = tự tính từ hạn cũ + số ngày' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.response_mode' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='NCC xác nhận thế nào?'>
                <MenuItem value='immediate'>Trả kết quả ngay</MenuItem>
                <MenuItem value='deferred'>Cần gọi lại sau để kiểm tra</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
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
  },
  renew: {
    enabled: false,
    mode: 'by_order',
    url: '',
    method: 'POST',
    auth_type: 'inherit',
    auth_param: '',
    params_rows: [],
    duration_param: 'days',
    duration_map_rows: [],
    duration_map_enabled: false,
    response_mode: 'immediate',
    success_field: '',
    success_value: '',
    new_expiry_field: '',
    inherit_params: [],
    batch_delay_ms: '0',
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

  // Chỉ watch conditional fields
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

              {/* ── Gia hạn (Renew) ── */}
              <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography fontWeight={600}>Cấu hình Gia hạn</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <RenewConfigFields control={control} />
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
