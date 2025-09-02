'use client';

import { SessionContext } from '@/app/contexts/SessionContext';

import type { Session } from 'next-auth';

// Component này nhận session (đã được fetch từ server) và children
export default function SessionProviderWrapper({
                                                 session,
                                                 children
                                               }: {
  session: Session | null;
  children: React.ReactNode;
}) {
  // Dùng Provider của Context để bọc các component con
  // và cung cấp giá trị session cho chúng
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
