export interface CumulativeMetrics {
  revenue: number
  total_topups: number
  topup_transactions: number
  total_costs: number
  total_refunds: number
  total_profit: number
  user_balance: number
  total_orders: number
  orders_success: number
  orders_failed: number
  orders_processing: number
}

export interface DailyMetrics extends CumulativeMetrics {
  date: string
}

export interface DashboardData {
  cumulative: CumulativeMetrics
  daily: DailyMetrics
}

export interface KPICardProps {
  label: string
  value: number
  icon: React.ReactNode
  delta?: number
  format?: 'currency' | 'number'
  trend?: number[]
  color?: 'blue' | 'green' | 'red' | 'gray'
}
