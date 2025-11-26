export default function LoadingSkeleton() {
  return (
    <div className='bg-white rounded-xl shadow-sm p-6 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='w-12 h-12 bg-gray-200 rounded-lg' />
        <div className='w-16 h-6 bg-gray-200 rounded' />
      </div>
      <div className='space-y-2'>
        <div className='w-32 h-8 bg-gray-200 rounded' />
        <div className='w-24 h-4 bg-gray-200 rounded' />
      </div>
    </div>
  )
}
