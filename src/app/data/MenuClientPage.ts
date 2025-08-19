// src/data/menus/landing-page/MenuLandingPage.ts
import { BarChart3, Clock, FileText, Globe, HelpCircle, History, ShoppingCart, User } from 'lucide-react'

const MenuClientPage = [
  { icon: BarChart3, label: 'Tổng quan', page: 'overview', count: null },
  {
    icon: Globe,
    label: 'Proxy Tĩnh',
    page: 'proxy',
    count: null,
    isParent: true,
    children: [
      { label: 'Proxy Tĩnh', page: 'static-proxy', count: 12 },
      { label: 'Proxy Xoay', page: 'proxy-xoay', count: 8 }
    ]
  },
  { icon: ShoppingCart, label: 'Check Proxy', page: 'check-proxy', count: null },
  { icon: FileText, label: 'Đơn hàng Proxy', page: 'proxy-orders', count: 5 },
  { icon: Clock, label: 'Đơn hàng Proxy xoay', page: 'rotating-orders', count: 2 },
  { icon: History, label: 'Lịch sử mua hàng', page: 'purchase-history', count: null },
  { icon: FileText, label: 'Lịch sử giao dịch', page: 'transaction-history', count: null },
  { icon: History, label: 'Lịch sử đổi proxy', page: 'change-history', count: null },
  { icon: User, label: 'Hướng dẫn', page: 'guide', count: null },
  { icon: HelpCircle, label: 'Hỗ trợ', page: 'support', count: null },
]

export default MenuClientPage
