export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' đ'
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value)
}

export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B'
  }

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }

  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }

  
return value.toString()
}
