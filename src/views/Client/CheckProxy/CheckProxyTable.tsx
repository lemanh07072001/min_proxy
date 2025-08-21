import './styles.css'
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Globe,
  Shield,
  Activity
} from 'lucide-react'

import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'

export default function CheckProxyTable({ data }) {
  return (
    <>
      <div className='results-panel'>
        <div className='results-card'>
          <div className='results-header'>
            <div className='results-title'>
              <CheckCircle size={20} className='text-green-500' />
              <span>Kết quả kiểm tra Proxy (1)</span>
            </div>
            <div className='results-actions'>
              <button className='action-btn-check'>
                <Download size={16} />
                Export
              </button>
              <button className='action-btn-check'>
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className='results-table'>
            <div className='table-header-check'>
              <div>STT</div>
              <div>Proxy</div>
              <div>IP</div>
              <div>Loại</div>
              <div>Trạng thái</div>
            </div>

            {data.map((result, index) => (
              <div key={result.id} className='table-row-check'>
                <div className='stt-cell'>{index + 1}</div>
                <div className='proxy-cell'>
                  <div className='proxy-text'>{result.proxy}</div>
                  <button className='copy-icon-btn'>
                    <Copy size={14} />
                  </button>
                </div>
                <div className='ip-cell'>{result.ip}</div>
                <div className='protocol-cell'>{result.protocol}</div>
                <div className='status-cell'>
                  {result.status === 'active' ? (
                    <>
                      <Chip
                        label='Đang hoạt động'
                        size='small'
                        icon={<i className='tabler-battery-1' />}
                        color='success'
                      />
                    </>
                  ) : (
                    <>
                      <Chip
                        label='Không hoạt động'
                        size='small'
                        icon={<i className='tabler-battery-1' />}
                        color='error'
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='pagination-check'>
            <div className='pagination-info'>
              <span>Tổng: 1</span>
              <span>Kích cỡ trang tính: 50</span>
              <span>Trang 1 / 1</span>
            </div>
            <Pagination count={5} shape='rounded' variant='outlined' color='primary' />
          </div>
        </div>
      </div>
    </>
  )
}
