// FILE: hooks/useCopy.ts

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useCopy(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string, successMessage?: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');

      toast.error('Trình duyệt không hỗ trợ sao chép!');

      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // ✅ Code của bạn đã đúng ở đây
      // ✨ Gợi ý: Sử dụng message tùy chỉnh hoặc một message mặc định
      toast.success(successMessage || 'Đã sao chép vào clipboard!');

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setIsCopied(false);

      toast.error('Sao chép thất bại!');

      return false;
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isCopied, timeout]);

  return [isCopied, copy] as const;
}

// Cách dùng nâng cao trong component:
// const [, copy] = useCopy();
// copy("0123456789", "Đã sao chép số tài khoản!");