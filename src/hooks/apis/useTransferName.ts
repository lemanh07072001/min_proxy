import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { setUser } from '@/store/userSlice'
import type { AppDispatch } from '@/store'

export const useUpdateTransferName = () => {
  const axiosAuth = useAxiosAuth()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async (transferName: string) => {
      const res = await axiosAuth.post('/update-transfer-name', { transfer_name: transferName })
      return res?.data
    },
    onSuccess: async () => {
      // Refetch user data to update Redux store
      try {
        const res = await axiosAuth.post('/me')
        if (res?.data) {
          dispatch(setUser(res.data))
        }
      } catch {
        // ignore
      }
    }
  })
}
