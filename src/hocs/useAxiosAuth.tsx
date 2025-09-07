// hooks/useAxiosAuth.ts
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession();
  const [accessToken, setAccessToken] = useState<string | undefined>(
    (session as any)?.access_token
  );


  // Ref để tránh call nhiều lần signOut
  const isSigningOut = useRef(false);

  useEffect(() => {
    // Cập nhật token khi session thay đổi
    setAccessToken((session as any)?.access_token);
  }, [session]);

  useEffect(() => {
    // Interceptor request: thêm token mới vào header
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor response: xử lý 401
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 401 && !isSigningOut.current) {
          const tokenError = (session as any)?.error;


          console.log(tokenError)
          if (tokenError === "RefreshAccessTokenError" || tokenError === "TokenReset") {
            // Token đã không thể refresh, phải logout
            isSigningOut.current = true;
            await signOut({ redirect: true });
            return Promise.reject(error);
          }

          try {
            // Cố gắng refresh session
            const refreshed = await updateSession();
            const newToken = (refreshed as any)?.access_token;

            if (newToken) {
              setAccessToken(newToken);
              // Retry request với token mới
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return axiosInstance(error.config);
            } else {
              isSigningOut.current = true;
              await signOut({ redirect: true });
            }
          } catch (err) {
            console.error("Failed to refresh session:", err);
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
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, updateSession]);

  return axiosInstance;
};

export default useAxiosAuth;
