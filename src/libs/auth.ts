// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import axiosInstance from '@/libs/axios'

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.refreshToken}`, // Gửi refresh token cũ
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    // Trả về token mới và giữ lại refresh token cũ nếu server không trả về cái mới
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
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

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */

        const { email, password } = credentials as { email: string; password: string }

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return {
              accessToken: data.access_token,
              accessTokenExpires: Date.now() + user.expires_in * 1000,
              refreshToken: user.refresh_token,
              user: data.user
            }
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    strategy: 'jwt',
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        accessTokenExpires: Date.now() + user.expires_in * 1000
        refreshToken: user.refresh_token
        token.user = user.user

        return token
      }

      // Nếu access token chưa hết hạn, trả về token hiện tại
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Nếu access token đã hết hạn, thử làm mới nó
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token.user
        session.accessToken = token.accessToken;
        session.error = token.error
      }

      return session
    }
  }
}
