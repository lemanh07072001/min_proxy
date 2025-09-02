// hooks/useAxiosAuth.js

import { useSession, signOut } from "next-auth/react";

import { useEffect } from "react";

import axiosInstance from "@/libs/axios";

const useAxiosAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Nếu lỗi không phải 401, bỏ qua
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // Nếu lỗi 401 xảy ra do refresh token thất bại, đăng xuất người dùng
        if (session?.error === "RefreshAccessTokenError") {
          signOut();
        }

        // Các trường hợp 401 khác (ví dụ: token không hợp lệ) có thể xử lý ở đây
        // Ví dụ: đăng xuất người dùng
        // signOut();

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  return axiosInstance;
};

export default useAxiosAuth;