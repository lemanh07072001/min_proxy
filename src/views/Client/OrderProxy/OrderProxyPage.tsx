'use client'

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  EyeOff,
  Globe,
  RefreshCw,
  RotateCcw,
  Shield
} from 'lucide-react'

import { useState } from 'react'

import "./styles.css"
import Pagination from '@mui/material/Pagination'

export default function OrderProxyPage({data}) {
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');


  const togglePasswordVisibility = (proxyId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [proxyId]: !prev[proxyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'viettel': return 'text-red-600 bg-red-50';
      case 'fpt': return 'text-orange-600 bg-orange-50';
      case 'vnpt': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge-active">Đang hoạt động</span>;
      case 'expired':
        return <span className="status-badge-expired">Hết hạn</span>;
      case 'suspended':
        return <span className="status-badge-suspended">Tạm dừng</span>;
      default:
        return <span className="status-badge-unknown">Không xác định</span>;
    }
  };

  const filteredOrders = data.filter(order =>
    order.proxy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  return (
    <>
      <div className="orders-content">
        {/* Toolbar */}


        {/* Proxy Table */}
        <div className="proxy-table-container">
          <div className="orders-toolbar">

            <div className="toolbar-right">
              <div className="action-buttons">
                <button className="action-btn-toolbar">
                  <Shield size={16} />
                  Đổi password
                </button>
                <button className="action-btn-toolbar">
                  <Clock size={16} />
                  Gia hạn
                </button>
                <button className="action-btn-toolbar">
                  <EyeOff size={16} />
                  Đổi thông tin
                </button>
                <button className="action-btn-toolbar primary">
                  <RotateCcw size={16} />
                  Đổi proxy
                </button>
                <button className="view-btn">
                  <Eye size={16} />
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="proxy-table">
            <div className="table-header-orders">
              <div className="th-stt">STT</div>
              <div className="th-id">Id</div>
              <div className="th-provider">Nhà mạng</div>
              <div className="th-proxy">Proxy</div>
              <div className="th-ip">Ip cũ</div>
              <div className="th-protocol">Loại</div>
              <div className="th-note">Note</div>
              <div className="th-expiry">Ngày hết hạn</div>
              <div className="th-remaining">Gia hạn</div>
              <div className="th-days">Ngày</div>
            </div>

            {filteredOrders.map((order, index) => (
              <div key={order.id} className="table-row-orders">
                <div className="td-stt">{index + 1}</div>
                <div className="td-id">{order.orderId}</div>
                <div className="td-provider">
                  <span className={`provider-badge ${getProviderColor(order.provider)}`}>
                    {order.provider}
                  </span>
                </div>
                <div className="td-proxy">
                  <div className="proxy-container">
                    <code className="proxy-text">{order.proxy}</code>
                    <button
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(order.proxy)}
                      title="Sao chép proxy"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="td-ip">
                  <code className="ip-text">{order.ip}</code>
                </div>
                <div className="td-protocol">
                  <span className="protocol-badge">{order.protocol}</span>
                </div>
                <div className="td-note">
                  <span className="note-text">{order.note || '-'}</span>
                </div>
                <div className="td-expiry">
                  <div className="expiry-container">
                    <Calendar size={14} className="calendar-icon" />
                    <span className="expiry-date">{order.expiryDate}</span>
                  </div>
                </div>
                <div className="td-remaining">
                  {getStatusBadge(order.status)}
                </div>
                <div className="td-days">
                  <span className={`days-count ${order.remainingDays < 0 ? 'expired' : order.remainingDays === 0 ? 'warning' : 'active'}`}>
                    {order.remainingDays}
                  </span>
                </div>
              </div>
            ))}
          </div>


          {/* Pagination */}
          <div className="pagination-orders">
            <div className="pagination-info">
              <span> <b className="me-1">{currentPage}</b> - <b className="me-1 ms-1">{totalPages} </b> của <b className="me-1 ms-1">{filteredOrders.length}</b> đơn hàng</span>
            </div>
            <Pagination count={3} shape='rounded' variant='outlined' color='primary' />
          </div>
        </div>

      </div>
    </>
  )
}
