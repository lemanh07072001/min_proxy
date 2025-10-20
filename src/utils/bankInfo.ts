export const getBankNumber = (userId: number | string) => {
  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return {
    bankCode: '970436',
    bankName: 'Vietcombank',
    accountNumber: '1056968673',
    accountName: 'LUONG VAN THUY',
    note: `mktproxy ${randomNumber}${userId}`
  }
}
