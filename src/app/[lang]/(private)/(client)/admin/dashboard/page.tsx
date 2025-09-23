// src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useAdminPermission } from '@/hooks/useAdminPermission'
import { Card, CardContent, CardHeader, CardTitle } from '@mui/material'
import { BarChart3, Users, Globe, CreditCard, Activity, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { isAdmin, isLoading } = useAdminPermission()

  // Nếu đang loading, hiển thị loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Nếu không phải admin, hiển thị thông báo không có quyền
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-600">Bạn không có quyền truy cập vào trang quản trị.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dữ liệu thống kê mẫu
  const stats = [
    {
      title: 'Tổng User',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Proxy Hoạt động',
      value: '856',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '23',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Doanh thu tháng',
      value: '12.5M VNĐ',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">
          Chào mừng {session?.user?.name || 'Admin'} đến với trang quản trị hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Quản lý User</h3>
              <p className="text-sm text-gray-600">Xem và quản lý người dùng</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Globe className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Quản lý Proxy</h3>
              <p className="text-sm text-gray-600">Cấu hình và quản lý proxy</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <CreditCard className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">Đơn hàng</h3>
              <p className="text-sm text-gray-600">Xem và xử lý đơn hàng</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">User mới đăng ký</p>
                <p className="text-xs text-gray-600">user@example.com vừa đăng ký tài khoản</p>
              </div>
              <span className="text-xs text-gray-500">5 phút trước</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Đơn hàng mới</p>
                <p className="text-xs text-gray-600">Đơn hàng #12345 đã được tạo</p>
              </div>
              <span className="text-xs text-gray-500">10 phút trước</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Proxy mới được thêm</p>
                <p className="text-xs text-gray-600">10 proxy mới đã được thêm vào hệ thống</p>
              </div>
              <span className="text-xs text-gray-500">1 giờ trước</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
