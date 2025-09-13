'use client'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'


export function OverviewPage() {
  const [proxys , setProxys] = useState([])

  const axiosAuth = useAxiosAuth()
  const { data: dataOverview = [], isLoading } = useQuery({
    queryKey: ['getOverview'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-overview')

      return res.data ?? []
    }
  })
  setProxys(dataOverview)
  console.log(dataOverview)

  return (
   <>
     <div className="flex-1 p-6 space-y-6">
       {/* Thông tin tài khoản */}
       <div className="grid gap-4 md:grid-cols-3">
         <div className="bg-card rounded-lg p-6 border" style={{background:'white'}}>
           <h3 className="text-sm font-medium text-muted-foreground">Số dư tài khoản</h3>
           <p className="text-2xl font-bold text-orange-600"> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataOverview?.total_amount ?? 0)}</p>
         </div>
         <div className="bg-card rounded-lg p-6 border" style={{background:'white'}}>
           <h3 className="text-sm font-medium text-muted-foreground">Proxy đang sử dụng</h3>
           <p className="text-2xl font-bold">{dataOverview?.total_proxy || 0}</p>
         </div>
         <div className="bg-card rounded-lg p-6 border" style={{background:'white'}}>
           <h3 className="text-sm font-medium text-muted-foreground">Proxy sắp hết hạn</h3>
           <p className="text-2xl font-bold text-red-600">{dataOverview?.near_expiry || 0}</p>
         </div>
       </div>
     </div>

     <div className="bg-card rounded-lg border">
       <div className="p-6 border-b">
         <h2 className="text-lg font-semibold">Proxy của bạn</h2>
       </div>
       <div className="p-6">
         <div className="space-y-4">
           {.map((proxy, index) => (
             <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
               <div className="space-y-1">
                 <p className="font-medium">{proxy.ip}</p>
                 <p className="text-sm text-muted-foreground">{proxy.location}</p>
               </div>
               <div className="text-right space-y-1">
                 <p
                   className={`text-sm font-medium ${
                     proxy.status === "Hoạt động" ? "text-green-600" : "text-red-600"
                   }`}
                 >
                   {proxy.status}
                 </p>
                 <p className="text-sm text-muted-foreground">Hết hạn: {proxy.expires}</p>
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   </>
  )
}