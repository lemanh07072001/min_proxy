// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Hàm refresh token, không thay đổi so với hướng dẫn trước
async function refreshAccessToken(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();

          if (res.ok && data) {
            return data; // Trả về data từ API (user, access_token, refresh_token)
          }
        } catch (error) {
          console.error("Authorize Error:", error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Logic callbacks jwt và session không thay đổi
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 phút
        token.user = user.user;
        return token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      console.log("Access token expired, refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Trang đăng nhập tùy chỉnh
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Thay vì export default, ta export GET và POST handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


