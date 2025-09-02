import { createContext } from 'react'

import type { Session } from 'next-auth'

export const SessionContext = createContext<Session | null>(null);
