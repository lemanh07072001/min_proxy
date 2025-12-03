/**
 * Tạo mã giao dịch theo format: 152 + date + random + id_user (không có dấu +)
 */
export const generateTransactionCode = (userId: number | string): string => {
  // Tạo ngày kiểu YYYYMMDD
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  // Tạo 6 ký tự ngẫu nhiên (alphanumeric uppercase)
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()

  // Tạo mã giao dịch: 152 + date + random + id_user (nối liền không có dấu +)
  return `152${date}${random}${userId}`
}

export const getBankNumber = (userId: number | string) => {
  // Sử dụng hàm generateTransactionCode để tạo mã giao dịch
  const transactionCode = generateTransactionCode(userId)

  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: transactionCode
  }
}
