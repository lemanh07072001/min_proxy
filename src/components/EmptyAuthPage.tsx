'use client'

import { LockKeyhole, ArrowRight, Shield } from 'lucide-react'

import { Button } from '@mui/material'

import { useModalContext } from '@/app/contexts/ModalContext'

interface EmptyAuthPageProps {
  lang: string
}

const EmptyAuthPage = ({ lang }: EmptyAuthPageProps) => {
  const { openAuthModal } = useModalContext()

  // Tạo một content area cho việc hiển thị trong layout
  return (
    <div className='flex items-center justify-center h-full p-8'>
      <div className='text-center max-w-lg'>
        <div className='mb-8 flex justify-center relative'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl'></div>
          </div>
          <div className='relative w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300'>
            <LockKeyhole className='w-14 h-14 text-cyan-400' />
          </div>
        </div>

        <div className='mb-4'>
          <h2 className='text-3xl font-bold text-slate-800 mb-3'>Yêu cầu đăng nhập</h2>
          <p className='text-slate-600 text-lg'>Bạn cần đăng nhập để truy cập trang này.</p>
        </div>

        <div className='flex items-center justify-center gap-6 my-8 py-6 border-y border-slate-200'>
          <div className='flex items-center gap-2 text-slate-600'>
            <Shield className='w-5 h-5 text-[#ef4444]' />
            <span className='text-sm font-medium'>Bảo mật cao</span>
          </div>
          <div className='w-px h-8 bg-slate-200'></div>
          <div className='flex items-center gap-2 text-slate-600'>
            <LockKeyhole className='w-5 h-5 text-[#ef4444]' />
            <span className='text-sm font-medium'>Mã hóa dữ liệu</span>
          </div>
        </div>

        <button
          onClick={() => openAuthModal('login')}
          style={{ background: 'var(--primary-gradient)' }}
          className='group px-10 py-4 text-white rounded-2xl font-semibold transition-all shadow-xl shadow-cyan-500/30 hover:shadow-2xl flex items-center gap-3 mx-auto '
        >
          Đăng nhập ngay
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </button>

        <p className='text-sm text-slate-500 mt-6'>
          Chưa có tài khoản?
          <Button onClick={() => openAuthModal('register')} className='text-[#ef4444] font-medium hover:underline'>
            Đăng ký ngay
          </Button>
        </p>
      </div>
    </div>
  )
}

export default EmptyAuthPage
