import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { setUser } from '@/store/userSlice'
import type { AppDispatch, RootState } from '@/store'

export const useUpdateTransferName = () => {
  const axiosAuth = useAxiosAuth()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.user)

  return useMutation({
    mutationFn: async (transferName: string) => {
      const res = await axiosAuth.post('/update-transfer-name', { transfer_name: transferName })

      return res?.data
    },
    onSuccess: (data) => {
      // Cập nhật transfer_config trực tiếp từ response — không cần gọi /me lại
      if (data?.transfer_config && currentUser) {
        dispatch(setUser({
          ...currentUser,
          transfer_config: data.transfer_config,
        }))
      }
    }
  })
}
