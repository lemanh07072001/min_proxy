export const getBankNumber = (userId: number | string) => {
  const random3 = Math.floor(100 + Math.random() * 900)

  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: `mktproxy ${random3}.${userId}`
  }
}
