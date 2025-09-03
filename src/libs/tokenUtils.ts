import type { JWT } from 'next-auth/jwt'

// Utility function để kiểm tra token có hợp lệ không
export function isTokenValid(token: JWT): boolean {
  if (!token.access_token || token.error) {
    return false;
  }
  
  if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number') {
    // Thêm buffer 5 phút để refresh trước khi hết hạn
    const bufferTime = 5 * 60 * 1000; // 5 phút
    return Date.now() < (token.accessTokenExpires - bufferTime);
  }
  
  return false;
}

// Function để refresh access token
export async function refreshAccessToken(token: JWT): Promise<JWT> {

  console.log(token)
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.minhan.online'}/refresh`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });



    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const refreshedTokens = await response.json();
    console.log('response: ', refreshedTokens)
    return {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      error: undefined // Clear any previous errors
    };
  } catch (error) {
    console.error('RefreshAccessTokenError:', error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Utility function để force refresh token (có thể gọi từ client)
export async function forceRefreshToken() {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();

    if (session.access_token) {
      // Trigger NextAuth update
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'update',
          access_token: session.access_token
        })
      });
    }
  } catch (error) {
    console.error('Error forcing token refresh:', error);
  }
}

// Hook để sử dụng trong components (không reload page)
export function useTokenRefresh() {
  const refreshToken = async () => {
    try {
      await forceRefreshToken();
      // Không reload page nữa, chỉ refresh session
      console.log('🔄 Token refresh triggered successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  return { refreshToken };
}

// Function để kiểm tra và refresh token trước khi gọi API
export async function ensureValidTokenBeforeApiCall() {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();

    if (session.access_token) {
      // Kiểm tra xem token có cần refresh không
      const tokenData = session as any;
      if (tokenData.accessTokenExpires && Date.now() >= tokenData.accessTokenExpires) {
        console.log('🔄 Token expired, triggering refresh before API call');
        // Chỉ refresh khi thực sự cần thiết và không gây vòng lặp
        try {
          await forceRefreshToken();
          console.log('✅ Token refreshed successfully');
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          // Không throw error để tránh vòng lặp
        }
      } else {
        console.log('✅ Token still valid, no refresh needed');
      }
    }
  } catch (error) {
    console.error('Error ensuring valid token:', error);
  }
}

// Function để lấy token hiện tại từ session
export async function getCurrentToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    return session.access_token || null;
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
}

// Function để gọi API với token tự động refresh
export async function apiCallWithTokenRefresh(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Đảm bảo token hợp lệ trước khi gọi API
    await ensureValidTokenBeforeApiCall();
    
    // Lấy token hiện tại
    const token = await getCurrentToken();
    
    if (!token) {
      throw new Error('No valid token available');
    }
    
    // Gọi API với token
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error in apiCallWithTokenRefresh:', error);
    throw error;
  }
}

// Function để kiểm tra trạng thái token
export async function checkTokenStatus(): Promise<{
  isValid: boolean;
  expiresAt: number | null;
  timeLeft: number | null;
}> {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    
    if (!session.access_token) {
      return { isValid: false, expiresAt: null, timeLeft: null };
    }
    
    const tokenData = session as any;
    const expiresAt = tokenData.accessTokenExpires;
    const currentTime = Date.now();
    
    if (!expiresAt) {
      return { isValid: false, expiresAt: null, timeLeft: null };
    }
    
    const timeLeft = expiresAt - currentTime;
    const isValid = timeLeft > 0;
    
    return { isValid, expiresAt, timeLeft };
  } catch (error) {
    console.error('Error checking token status:', error);
    return { isValid: false, expiresAt: null, timeLeft: null };
  }
}
