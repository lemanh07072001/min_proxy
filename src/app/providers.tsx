// app/providers.js
'use client'; // Đánh dấu đây là Client Component

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}