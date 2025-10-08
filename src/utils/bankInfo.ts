export const getBankNumber = (userId: number | string) => {
  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: `mktproxy ${userId}`
  }
}
