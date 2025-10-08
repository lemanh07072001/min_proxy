export const getBankNumber = (userId: number | string) => {
  const random3 = Math.floor(100 + Math.random() * 900)

  const stringNote = random3 + '.' + userId

  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: `mktproxy ${stringNote}`
  }
}
