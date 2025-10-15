export const metadata = {
  title: 'Unauthorized'
}

export default function UnauthorizedPage() {
  return (
    <div className='flex items-center justify-center min-h-[50vh]'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-2'>Bạn không có quyền truy cập trang này</h1>
        <p className='text-gray-600'>Vui lòng quay lại trang chủ hoặc đăng nhập để tiếp tục.</p>
      </div>
    </div>
  )
}
