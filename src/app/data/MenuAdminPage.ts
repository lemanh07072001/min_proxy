// src/app/data/MenuAdminPage.ts
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  FileText, 
  CreditCard,
  Globe,
  UserCheck,
  Activity
} from 'lucide-react'

const MenuAdminPage = [
  { 
    icon: BarChart3, 
    label: 'Dashboard Admin', 
    page: 'admin/dashboard', 
    count: null 
  },
  {
    icon: Users,
    label: 'Quản lý User',
    page: 'admin/users',
    count: null,
    isParent: true,
    children: [
      { label: 'Danh sách User', page: 'admin/users/list', count: null },
      { label: 'Thêm User mới', page: 'admin/users/create', count: null },
      { label: 'Phân quyền User', page: 'admin/users/permissions', count: null }
    ]
  },
  {
    icon: Globe,
    label: 'Quản lý Proxy',
    page: 'admin/proxy',
    count: null,
    isParent: true,
    children: [
      { label: 'Danh sách Proxy', page: 'admin/proxy/list', count: null },
      { label: 'Thêm Proxy mới', page: 'admin/proxy/create', count: null },
      { label: 'Cấu hình Proxy', page: 'admin/proxy/config', count: null }
    ]
  },
  {
    icon: CreditCard,
    label: 'Quản lý Đơn hàng',
    page: 'admin/orders',
    count: null,
    isParent: true,
    children: [
      { label: 'Tất cả đơn hàng', page: 'admin/orders/all', count: null },
      { label: 'Đơn hàng chờ xử lý', page: 'admin/orders/pending', count: null },
      { label: 'Lịch sử giao dịch', page: 'admin/orders/transactions', count: null }
    ]
  },
  {
    icon: Database,
    label: 'Quản lý Hệ thống',
    page: 'admin/system',
    count: null,
    isParent: true,
    children: [
      { label: 'Cấu hình hệ thống', page: 'admin/system/config', count: null },
      { label: 'Backup dữ liệu', page: 'admin/system/backup', count: null },
      { label: 'Logs hệ thống', page: 'admin/system/logs', count: null }
    ]
  },
  {
    icon: Activity,
    label: 'Báo cáo & Thống kê',
    page: 'admin/reports',
    count: null,
    isParent: true,
    children: [
      { label: 'Báo cáo doanh thu', page: 'admin/reports/revenue', count: null },
      { label: 'Thống kê user', page: 'admin/reports/users', count: null },
      { label: 'Thống kê proxy', page: 'admin/reports/proxy', count: null }
    ]
  },
  {
    icon: Shield,
    label: 'Bảo mật',
    page: 'admin/security',
    count: null,
    isParent: true,
    children: [
      { label: 'Quản lý API Keys', page: 'admin/security/api-keys', count: null },
      { label: 'Audit Logs', page: 'admin/security/audit', count: null },
      { label: 'Cài đặt bảo mật', page: 'admin/security/settings', count: null }
    ]
  },
  {
    icon: Settings,
    label: 'Cài đặt',
    page: 'admin/settings',
    count: null,
    isParent: true,
    children: [
      { label: 'Cài đặt chung', page: 'admin/settings/general', count: null },
      { label: 'Cài đặt email', page: 'admin/settings/email', count: null },
      { label: 'Cài đặt thanh toán', page: 'admin/settings/payment', count: null }
    ]
  }
]

export default MenuAdminPage
