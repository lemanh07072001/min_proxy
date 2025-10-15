
import { useEffect, useState } from 'react'
import {

  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hocs/useAxiosAuth'


export default function GetToken(){
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const { data: session, update } = useSession() // ✅ cần update

  console.log(session)
  const axiosAuth = useAxiosAuth()

  useEffect(() => {
    setToken(session?.access_token)
  }, [session])

  const handleReload = async () => {

    try {
      setIsLoading(true);

      const res = await axiosAuth.post('/get-new-token');

      if (res?.data?.access_token) {
        console.log('✅ Token mới:', res.data.access_token)

        // ✅ Cập nhật token mới vào NextAuth session
        await update({

          access_token: res.data.access_token,

        })
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);

    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);

  };

  return (
    <div className="p-8 max-w-4xl">

      <div className=' border-b border-gray-100'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-green-100 rounded-lg'>
            <Shield className='w-5 h-5 text-green-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Bảo mật</h2>
            <p className='text-sm text-gray-600'>Cài đặt bảo mật tài khoản</p>
          </div>
        </div>
      </div>

        <div className="space-y-5 pt-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
              Token
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  id="token"
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập token của bạn..."
                  className="w-full px-4 py-3 !pr-[100px] bg-white border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                {token && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {showToken ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={copyToken}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleReload}
                disabled={!token  || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 whitespace-nowrap"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Đang xử lý...' : 'Reload'}
              </button>
            </div>
          </div>
        </div>
      
    </div>
  )
}
