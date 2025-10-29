import { ChevronRight, CreditCard, Mail, Phone, Shield, X, MapPin, User, Calendar } from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import { formatDateTimeLocal } from '@/utils/formatDate'

export default function DetailUserModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
  if (!isOpen) return null;

  console.log(data)
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={isOpen}
      closeAfterTransition={false}
      maxWidth='md'
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >

      <div className="relative bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Thông tin người dùng</h2>
              <p className="text-orange-100 text-sm mb-0">Chi tiết tài khoản và hoạt động</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {data?.user?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-gray-900">{data?.user?.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}>
                    Đang hoạt động
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Shield size={14} className="text-orange-500" />
                  <span className='font-bold'>{data?.user?.role.toUpperCase()}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">ID: {data?.user?.id}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-700 font-medium">Tổng đơn hàng</span>
                <CreditCard size={20} className="text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-900">{data?.order_count}</div>
              <div className="text-xs text-orange-600 mt-1">Đơn hàng đã mua</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700 font-medium">Tổng chi tiêu</span>
                <CreditCard size={20} className="text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-900">{new Intl.NumberFormat('vi-VN').format(data?.user?.chitieu) + ' đ'}</div>
              <div className="text-xs text-green-600 mt-1">Giá trị mua hàng</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Mail size={18} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Email</div>
                  <div className="text-sm font-medium text-gray-900">{data?.user?.email}</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Calendar size={18} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Ngày tham gia</div>
                  <div className="text-sm font-medium text-gray-900">{formatDateTimeLocal(data?.user?.created_at)}</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>


          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow">
              Chỉnh sửa thông tin
            </button>
            <button className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
              Xem lịch sử giao dịch
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}