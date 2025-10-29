import { useState, useEffect } from 'react';

// Custom hooks để debounce giá trị
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập một timeout để cập nhật giá trị debounced sau khoảng thời gian delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp timeout nếu value thay đổi (ví dụ người dùng tiếp tục gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}