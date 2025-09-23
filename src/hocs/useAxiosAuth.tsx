// hooks/useAxiosAuth.ts
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/libs/axios'; // axios instance của bạn

// Biến cờ để đảm bảo chỉ có một request refresh được gửi đi
let isRefreshing = false;

const useAxiosAuth = () => {
  const { data: session, update } = useSession();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      async (config) => {
        if (!session?.accessToken) return config;

        // Đặt buffer time (ví dụ: 5 phút) để refresh trước khi token hết hạn
        const bufferTime =  60 * 1000;
        const now = Date.now();
        const tokenExpires = session.accessTokenExpires as number;

        const isTokenExpiring = now > tokenExpires - bufferTime;

        if (isTokenExpiring && !isRefreshing) {
          isRefreshing = true;
          try {
            console.log('🔄 Token is expiring, attempting to refresh...');
            // Dùng axios gốc để tránh interceptor loop
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
              {},
              { headers: { Authorization: `Bearer ${session.accessToken}` } }
            );
            
            const newAccessToken = response.data.access_token;
            const newExpiresIn = response.data.expires_in;

            // Cập nhật session với token mới
            await update({
              ...session,
              accessToken: newAccessToken,
              accessTokenExpires: Date.now() + newExpiresIn * 1000,
            });
            
            console.log('✅ Token refreshed successfully.');

            // Cập nhật header cho request hiện tại và các request sau
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          } catch (error) {
            console.error('❌ Could not refresh token.', error);
            // Xử lý lỗi refresh, ví dụ: signOut();
          } finally {
            isRefreshing = false;
          }
        }
        
        // Luôn gán token mới nhất vào header
        if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
    };
  }, [session, update]);

  return axiosInstance;
};

export default useAxiosAuth;
