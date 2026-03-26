'use client'

import { memo, useCallback, useState } from 'react'

import { useQueueStatus, useClearCircuitBreaker } from '@/hooks/apis/useQueueStatus'
import type { LogEntry, WorkerState, CircuitBreaker } from '@/hooks/apis/useQueueStatus'

export default function QueueMonitorPage() {
  const [enabled, setEnabled] = useState(true)
  const { data, isLoading } = useQueueStatus(enabled)
  const clearCB = useClearCircuitBreaker()

  const handleClearCB = useCallback(
    (provider: string) => clearCB.mutate(provider),
    [clearCB]
  )

  if (isLoading) return <div className='p-6 text-gray-500'>Loading...</div>

  return (
    <div className='p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-bold text-gray-800'>Queue Monitor</h1>
        <button
          onClick={() => setEnabled(e => !e)}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
            enabled
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-gray-50 border-gray-300 text-gray-500'
          }`}
        >
          {enabled ? '● Live' : '○ Paused'}
        </button>
      </div>

      {/* Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatCard label='Queue Mua' value={data?.queues.placeorder ?? 0} color='blue' />
        <StatCard label='Queue Gia hạn' value={data?.queues.renewal ?? 0} color='green' />
        <WorkerCard name='Worker Mua' worker={data?.workers.placeorder} />
        <WorkerCard name='Worker Gia hạn' worker={data?.workers.renewal} />
      </div>

      {/* Circuit Breakers */}
      <CBSection breakers={data?.circuit_breakers ?? {}} onClear={handleClearCB} clearing={clearCB.isPending} />

      {/* Log */}
      <LogTable logs={data?.logs ?? []} />
    </div>
  )
}

// ─── Sub-components (memo) ───

const StatCard = memo(function StatCard({ label, value, color }: { label: string; value: number; color: 'blue' | 'green' }) {
  const accent = color === 'blue' ? 'text-blue-600' : 'text-green-600'

  return (
    <div className='bg-white rounded-lg border border-gray-100 px-4 py-3'>
      <p className='text-[11px] text-gray-400 uppercase tracking-wide'>{label}</p>
      <p className={`text-2xl font-bold ${accent} mt-0.5`}>{value}</p>
    </div>
  )
})

const WorkerCard = memo(function WorkerCard({ name, worker }: { name: string; worker?: WorkerState | null }) {
  const active = !!worker

  return (
    <div className={`rounded-lg border px-4 py-3 ${active ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
      <div className='flex items-center justify-between'>
        <p className='text-[11px] text-gray-400 uppercase tracking-wide'>{name}</p>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            active ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {active ? 'ACTIVE' : 'IDLE'}
        </span>
      </div>
      {active ? (
        <div className='mt-1.5 space-y-0.5'>
          <p className='text-sm font-medium text-gray-800'>
            #{worker.order_id}
            {worker.provider && <span className='text-gray-400 ml-1 font-normal'>[{worker.provider}]</span>}
          </p>
          {worker.progress && <p className='text-xs text-amber-700'>{worker.progress}</p>}
          {worker.item && <p className='text-xs text-gray-400 truncate max-w-[180px]'>{worker.item}</p>}
        </div>
      ) : (
        <p className='text-xs text-gray-300 mt-1'>—</p>
      )}
    </div>
  )
})

const CBSection = memo(function CBSection({
  breakers,
  onClear,
  clearing
}: {
  breakers: Record<string, CircuitBreaker>
  onClear: (p: string) => void
  clearing: boolean
}) {
  const entries = Object.entries(breakers)

  if (entries.length === 0) return null

  return (
    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
      <p className='text-xs font-semibold text-red-700 mb-2'>
        Circuit Breaker — {entries.length} NCC tạm dừng
      </p>
      {entries.map(([provider, cb]) => (
        <div key={provider} className='flex items-center justify-between bg-white rounded px-3 py-1.5 mb-1 last:mb-0 border border-red-100'>
          <div className='text-sm'>
            <span className='font-medium text-red-700'>{provider}</span>
            <span className='text-gray-400 text-xs ml-2'>{cb.reason}</span>
            <span className='text-red-400 text-xs ml-2'>({cb.ttl}s)</span>
          </div>
          <button
            disabled={clearing}
            onClick={() => onClear(provider)}
            className='text-xs text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 disabled:opacity-50 transition-colors'
          >
            Mở lại
          </button>
        </div>
      ))}
    </div>
  )
})

const LogTable = memo(function LogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className='bg-white rounded-lg border border-gray-100 overflow-hidden'>
      <div className='px-3 py-2 border-b border-gray-100 flex items-center justify-between'>
        <p className='text-xs font-semibold text-gray-600'>Activity Log</p>
        <span className='text-[10px] text-gray-300'>{logs.length}/100</span>
      </div>
      <div className='max-h-[420px] overflow-y-auto'>
        {logs.length === 0 ? (
          <p className='p-4 text-xs text-gray-300 text-center'>—</p>
        ) : (
          <table className='w-full'>
            <thead className='sticky top-0 bg-gray-50/95 backdrop-blur-sm'>
              <tr className='text-[10px] text-gray-400 uppercase tracking-wider'>
                <th className='text-left px-3 py-1.5 w-16'>Time</th>
                <th className='text-left px-2 py-1.5 w-20'>Worker</th>
                <th className='text-left px-2 py-1.5'>Message</th>
                <th className='text-left px-2 py-1.5 w-16'>Order</th>
                <th className='text-left px-2 py-1.5 w-20'>NCC</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <LogRow key={`${log.t}-${log.w}-${i}`} log={log} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
})

const WORKER_BADGE: Record<string, string> = {
  renewal: 'bg-green-100 text-green-700',
  placeorder: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700'
}

const LogRow = memo(function LogRow({ log }: { log: LogEntry }) {
  const m = log.m || ''
  const isFail = m.includes('FAIL') || m.includes('EXCEPTION') || m.includes('CB triggered')
  const rowBg = isFail ? 'bg-red-50/60' : m.includes('CB ') ? 'bg-orange-50/40' : ''

  return (
    <tr className={rowBg}>
      <td className='px-3 py-1 text-[11px] text-gray-400 font-mono'>{log.t}</td>
      <td className='px-2 py-1'>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${WORKER_BADGE[log.w] || 'bg-gray-100 text-gray-500'}`}>
          {log.w}
        </span>
      </td>
      <td className={`px-2 py-1 text-[11px] ${isFail ? 'text-red-600' : 'text-gray-600'}`}>{m}</td>
      <td className='px-2 py-1 text-[11px] text-gray-400'>{log.o ?? ''}</td>
      <td className='px-2 py-1 text-[11px] text-gray-400'>{log.p ?? ''}</td>
    </tr>
  )
})
