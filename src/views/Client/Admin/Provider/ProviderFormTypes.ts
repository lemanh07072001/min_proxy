import type { Control } from 'react-hook-form'

// ─── Types ──────────────────────────────────────────

export interface ErrorCodeRule {
  field: string
  value: string
  match: 'exact' | 'contains'
  message: string
}

export interface HttpErrorRule {
  status: string
  message: string
}

export interface ResponseMappingRule {
  from: string
  to: string
  store: string
}

export interface ApiConfigBuyResponse {
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

export interface FetchProxiesConfig {
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

export interface ApiConfigBuy {
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

export interface ApiConfigRotate {
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

export interface IpConfig {
  enabled: boolean
  mode: string
  max_ips: number
  param: string
  param_format: string
}

// ─── Legacy types (dùng cho deserialize config cũ) ──

export interface InheritParam {
  source: 'order' | 'order_item'
  field: string
  param: string
}

export interface RenewParamRow {
  param_name: string
  value_type: 'provider_order_code' | 'provider_item_id' | 'duration' | 'custom'
  custom_value: string
}

export interface DurationMapRow {
  days: string
  send_value: string
}

// ─── New unified renew param ────────────────────────

export interface RenewParamSelectOption {
  value: string
  label: string
}

export interface RenewParamConfig {
  param: string                                              // Tên param gửi NCC
  source: 'orders' | 'order_items' | 'user_input' | 'default' // Nguồn giá trị
  field?: string                                              // Field trong DB (khi source=orders|order_items)
  field_label?: string                                        // Label hiện cho admin (VD: "Mã proxy NCC")
  value?: string                                              // Giá trị cố định (khi source=default)
  input_type?: 'number' | 'string' | 'select'                // Kiểu input (khi source=user_input)
  input_label?: string                                        // Label hiện cho user (khi source=user_input)
  min?: number                                                // Validate min (khi input_type=number)
  max?: number                                                // Validate max (khi input_type=number)
  options?: RenewParamSelectOption[]                           // Danh sách chọn (khi input_type=select)
  is_duration?: boolean                                       // Đánh dấu param này là "số ngày gia hạn"
}

export interface RenewConfig {
  enabled: boolean
  mode: string
  url: string
  method: string
  auth_type: string
  auth_param: string
  renew_params: RenewParamConfig[]                             // 1 bảng thống nhất
  duration_map_override: boolean                               // true = dùng riêng, false = dùng chung từ tab Mua
  duration_map_rows: DurationMapRow[]                          // Bảng quy đổi (khi override=true)
  response_mode: string
  success_field: string
  success_value: string
  new_expiry_field: string
  batch_delay_ms: string
}

export interface FormValues {
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

export interface ModalAddProviderProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  providerData?: any
}

// ─── Shared prop type for sections ──────────────────

export interface SectionProps {
  control: Control<FormValues>
}

export interface BuySectionProps extends SectionProps {
  prefix: 'buy_rotating' | 'buy_static'
}

// ─── Constants ──────────────────────────────────────

export const SYSTEM_VARS: Record<string, RenewParamRow['value_type']> = {
  '{provider_order_code}': 'provider_order_code',
  '{provider_item_id}': 'provider_item_id',
  '{duration}': 'duration',
}

export const VALUE_MAP: Record<string, string> = {
  provider_order_code: '{provider_order_code}',
  provider_item_id: '{provider_item_id}',
  duration: '{duration}',
}

export const VALUE_LABELS: Record<string, string> = {
  provider_order_code: 'Mã đơn NCC',
  provider_item_id: 'Mã proxy NCC',
  duration: 'Số ngày gia hạn',
  custom: 'Nhập tự do',
}

export const ORDER_FIELDS = [
  { value: 'order_code', label: 'Mã đơn hàng' },
  { value: 'quantity', label: 'Số lượng' },
  { value: 'time', label: 'Thời hạn gốc (ngày)' },
  { value: 'country', label: 'Quốc gia' },
  { value: 'protocol', label: 'Giao thức' },
  { value: 'ip_version', label: 'IP version' },
  { value: 'proxy_type', label: 'Loại proxy' },
]

export const ITEM_FIELDS = [
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

// ─── Defaults ───────────────────────────────────────

export const defaultFetchProxies: FetchProxiesConfig = {
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

export const defaultBuy: ApiConfigBuy = {
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

export const defaultValues: FormValues = {
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
    renew_params: [],
    duration_map_override: false,
    duration_map_rows: [],
    response_mode: 'immediate',
    success_field: '',
    success_value: '',
    new_expiry_field: '',
    batch_delay_ms: '0',
  }
}
