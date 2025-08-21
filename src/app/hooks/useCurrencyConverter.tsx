import { useMemo } from 'react';

// Sử dụng "as const" để TypeScript hiểu rằng đối tượng này là bất biến.
// Điều này cho phép chúng ta tạo ra một kiểu union chính xác từ các key của nó.
const EXCHANGE_RATES_FROM_VND = {
  VND: 1,
  USD: 25450,
  LAK: 1.17,
  EUR: 27200,
  JPY: 162.5,
} as const;

// Tạo một kiểu (type) mới tên là CurrencyCode.
// Nó sẽ là một union của các key từ đối tượng trên: 'VND' | 'USD' | 'LAK' | ...
export type CurrencyCode = keyof typeof EXCHANGE_RATES_FROM_VND;

// Sử dụng Record<CurrencyCode, string> để đảm bảo mọi CurrencyCode đều có locale tương ứng.
const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  VND: 'vi-VN',
  USD: 'en-US',
  LAK: 'lo-LA',
  EUR: 'de-DE',
  JPY: 'ja-JP',
};

/**
 * Hook để quy đổi từ VND sang một loại tiền tệ khác và định dạng nó.
 * @param amountInVND - Số tiền bằng VND cần quy đổi.
 * @param targetCurrency - Mã tiền tệ muốn quy đổi sang.
 * @returns Chuỗi tiền tệ đã được quy đổi và định dạng.
 */
const useCurrencyConverter = (
  amountInVND: number,
  targetCurrency: CurrencyCode = 'VND'
): string => {
  const convertedAndFormattedAmount = useMemo(() => {
    // 1. Kiểm tra đầu vào
    if (typeof amountInVND !== 'number' || isNaN(amountInVND)) {
      return '';
    }

    // 2. Lấy tỉ giá (TypeScript biết chắc chắn 'rate' là một number)
    const rate = EXCHANGE_RATES_FROM_VND[targetCurrency];

    // 3. Quy đổi sang tiền tệ mới
    const convertedAmount = amountInVND / rate;

    // 4. Định dạng số tiền đã quy đổi (TypeScript biết 'locale' là một string)
    const locale = CURRENCY_LOCALES[targetCurrency];

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
      }).format(convertedAmount);
    } catch (error) {
      console.error(`Lỗi định dạng tiền tệ: "${targetCurrency}"`, error);

      return convertedAmount.toString();
    }
  }, [amountInVND, targetCurrency]);

  return convertedAndFormattedAmount;
};

export default useCurrencyConverter;