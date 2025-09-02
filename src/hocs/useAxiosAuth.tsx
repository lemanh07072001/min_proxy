// hooks/useAxiosAuth.js

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import axiosInstance from "@/libs/axios";

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession();

  // Tạo một ref để theo dõi trạng thái đăng xuất
  const isSigningOut = useRef(false);

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        // Lấy accessToken từ session
        const accessToken = (session as any)?.access_token;

        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          console.log('Request interceptor: Token added to headers', {
            url: config.url,
            hasToken: !!accessToken,
            tokenLength: accessToken?.length
          });
        } else {
          console.log('Request interceptor: No token available', {
            url: config.url,
            hasSession: !!session
          });
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('Response interceptor: Error occurred', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message
        });

        // Nếu lỗi không phải 401, bỏ qua
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // Kiểm tra nếu có lỗi token
        if ((session as any)?.error && !isSigningOut.current) {
          const tokenError = (session as any)?.error;
          
          if (tokenError === "RefreshAccessTokenError" || tokenError === "TokenExpired") {
            // Đặt cờ để ngăn các lỗi 401 khác gọi signOut() một lần nữa
            isSigningOut.current = true;

            if (tokenError === "TokenExpired") {
              console.log("Token expired, Laravel backend không hỗ trợ refresh, signing out...");
            } else {
              console.log("Refresh token failed, signing out...");
            }
            
            await signOut({ redirect: true });
            return Promise.reject(error);
          }
        }

        // Nếu không có lỗi token nghiêm trọng, thử refresh session
        if (!isSigningOut.current) {
          try {
            console.log("Attempting to refresh session...");
            await updateSession();
            console.log("Session refreshed successfully");
          } catch (refreshError) {
            console.error("Failed to refresh session:", refreshError);
            if (!isSigningOut.current) {
              isSigningOut.current = true;
              await signOut({ redirect: true });
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [session, updateSession]);

  return axiosInstance;
};

export default useAxiosAuth;
