// hooks/useAxiosAuth.ts
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { Session } from "next-auth";

// Các biến này được đặt bên ngoài hook để chúng hoạt động như một singleton,
// chia sẻ trạng thái giữa tất cả các lần sử dụng hook.
let isRefreshing = false;
let failedQueue: { 
  resolve: (value?: any) => void; 
  reject: (reason?: any) => void 
}[] = [];

// Hàm để xử lý tất cả các request đang chờ trong hàng đợi
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    // Interceptor cho REQUEST - Gắn token vào mỗi request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Chỉ thêm token nếu chưa có sẵn để tránh ghi đè
        if (session?.access_token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor cho RESPONSE - Xử lý lỗi 401
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Chỉ xử lý khi gặp lỗi 401 và request đó chưa được thử lại
        if (error.response?.status === 401 && !originalRequest._retry) {
          
          if (isRefreshing) {
            // Nếu đã có một request khác đang thực hiện refresh token,
            // ta sẽ đẩy request hiện tại vào hàng đợi.
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axiosInstance(originalRequest); // Thử lại request với token mới
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true; // Đánh dấu là đã thử lại để tránh lặp vô hạn
          isRefreshing = true; // "Khóa" lại, chỉ cho một request được refresh

          try {
            console.log("Token expired. Attempting to refresh session via updateSession()...");
            const refreshedSession = await updateSession() as Session & { access_token?: string };

            if (!refreshedSession?.access_token) {
              throw new Error("Failed to refresh token: New session did not contain access_token.");
            }
            
            const newToken = refreshedSession.access_token;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            // Refresh thành công, xử lý hàng đợi
            console.log("Token refreshed successfully. Processing failed queue...");
            processQueue(null, newToken);

            // Thử lại request gốc ban đầu
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);

          } catch (refreshError: any) {
            console.error("Critical error during token refresh:", refreshError);
            // Nếu refresh thất bại, từ chối tất cả request đang chờ và logout
            processQueue(refreshError, null);
            await signOut(); // Chuyển hướng về trang login
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false; // "Mở khóa" sau khi hoàn tất
          }
        }

        return Promise.reject(error);
      }
    );

    // Gỡ bỏ interceptor khi component không còn được sử dụng
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [session, updateSession]); // Chạy lại effect khi session thay đổi

  return axiosInstance;
};

export default useAxiosAuth;
