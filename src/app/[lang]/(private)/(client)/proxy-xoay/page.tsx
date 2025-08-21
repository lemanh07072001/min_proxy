
import React from 'react'


import "./styles.css"
import RotatingProxyPage from '@views/Client/RotatingProxy/RotatingProxyPage'


export default function RotatingProxy() {
  const proxyPlans = [
    {
      id: 'daily',
      title: 'Proxy xoay 1 ngày',
      timeUnit: { field: 'days', label: 'ngày' },
      features: [
        { label: 'Kiểu mạng', value: 'Cáp quang', status: 'success' },
        { label: 'IPv4 sach-Unlimited Bandwidth', value: '', status: 'success' },
        { label: 'Nhà mạng', value: 'Viettel, FPT, VNPT', status: 'success' },
        { label: 'Thời gian đổi IP tối thiểu', value: '60 giây / lần', status: 'success' },
        { label: 'Giữ IP / Xoay IP', value: '', status: 'success' },
        { label: 'Vị trí', value: 'Ngẫu nhiên', status: 'success' },
        { label: 'Ngày sử dụng', status: 'input', inputType: 'number', field: 'days' },
        { label: 'Số lượng', status: 'input', inputType: 'number', field: 'quantity' },
        { label: 'Tài khoản', status: 'input', field: 'username' },
        { label: 'Mật khẩu', status: 'input', field: 'password' },
        { label: 'Tự động xoay', status: 'checkbox', field: 'autoRotate' },
        { label: 'Thời gian xoay (phút)', status: 'input', inputType: 'number', field: 'rotationTime', value: 1 }
      ],
      price: '3,000',
      color: 'daily'
    },
    {
      id: 'weekly',
      title: 'Proxy xoay 1 tuần',
      timeUnit: { field: 'weeks', label: 'tuần' },
      features: [
        { label: 'Kiểu mạng', value: 'Cáp quang', status: 'success' },
        { label: 'IPv4 sach-Unlimited Bandwidth', value: '', status: 'success' },
        { label: 'Nhà mạng', value: 'Viettel, FPT, VNPT', status: 'success' },
        { label: 'Thời gian đổi IP tối thiểu', value: '60 giây / lần', status: 'success' },
        { label: 'Giữ IP / Xoay IP', value: '', status: 'success' },
        { label: 'Vị trí', value: 'Ngẫu nhiên', status: 'success' },
        { label: 'Tuần sử dụng', status: 'input', inputType: 'number', field: 'weeks' },
        { label: 'Số lượng', status: 'input', inputType: 'number', field: 'quantity' },
        { label: 'Tài khoản', status: 'input', field: 'username' },
        { label: 'Mật khẩu', status: 'input', field: 'password' },
        { label: 'Tự động xoay', status: 'checkbox', field: 'autoRotate' },
        { label: 'Thời gian xoay (phút)', status: 'input', inputType: 'number', field: 'rotationTime' }
      ],
      price: '21,000',
      color: 'weekly'
    },
    {
      id: 'monthly',
      title: 'Proxy xoay 1 tháng',
      timeUnit: { field: 'months', label: 'tháng' },
      features: [
        { label: 'Kiểu mạng', value: 'Cáp quang', status: 'success' },
        { label: 'IPv4 sach-Unlimited Bandwidth', value: '', status: 'success' },
        { label: 'Nhà mạng', value: 'Viettel, FPT, VNPT', status: 'success' },
        { label: 'Thời gian đổi IP tối thiểu', value: '60 giây / lần', status: 'success' },
        { label: 'Giữ IP / Xoay IP', value: '', status: 'success' },
        { label: 'Vị trí', value: 'Ngẫu nhiên', status: 'success' },
        { label: 'Tháng sử dụng', status: 'input', inputType: 'number', field: 'months' },
        { label: 'Số lượng', status: 'input', inputType: 'number', field: 'quantity' },
        { label: 'Tài khoản', status: 'input', field: 'username' },
        { label: 'Mật khẩu', status: 'input', field: 'password' },
        { label: 'Tự động xoay', status: 'checkbox', field: 'autoRotate' },
        { label: 'Thời gian xoay (phút)', status: 'input', inputType: 'number', field: 'rotationTime' }
      ],
      price: '63,000',
      color: 'monthly'
    }
  ];

  return (
    <div className="proxy-xoay-page">

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Proxy Dân Cư</h1>
          <p className="page-subtitle">Chọn gói proxy phù hợp với nhu cầu của bạn</p>
        </div>
      </div>
      <div className="plans-container">
        <RotatingProxyPage data={proxyPlans}/>
      </div>
    </div>
  )
}
