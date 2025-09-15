export const getBankNumber = (userId: number | string) => {
  const paddedId = String(userId).padStart(6, '0')

  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: `PM KH_${paddedId}`
  }
}
