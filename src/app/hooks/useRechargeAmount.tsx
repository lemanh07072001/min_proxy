import { useState, useMemo } from 'react';

/**
 * Hàm tiện ích để định dạng tiền tệ Việt Nam (VND).
 * @param {string|number} amount - Giá trị số tiền thô.
 * @returns {string} - Chuỗi đã được định dạng (ví dụ: "10.000₫").
 */
const formatVND = (amount :any) => {
  if (isNaN(amount) || amount === null || amount === '') {
    return '';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

/**
 * Hook tùy chỉnh để quản lý và định dạng giá trị input tiền tệ.
 * @returns {Object} - Đối tượng chứa giá trị thô, giá trị hiển thị, hàm xử lý thay đổi, và trạng thái hợp lệ.
 */
export const useMoneyFormat = () => {
  const [amount, setAmount] = useState('');

  // Hàm xử lý khi người dùng nhập liệu, chỉ chấp nhận các ký tự số
  const handleChange = (event :any) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, '');

    setAmount(rawValue);
  };

  // Sử dụng useMemo để tính toán giá trị hiển thị đã được định dạng.
  // Điều này đảm bảo giá trị chỉ được cập nhật khi 'amount' thay đổi.
  const displayAmount = useMemo(() => formatVND(amount), [amount]);

  // Trạng thái boolean để kiểm tra xem số tiền có hợp lệ hay không (lớn hơn 0)
  const isValid = Number(amount) > 0;

  return {
    amount,
    displayAmount,
    handleChange,
    isValid,
  };
};