'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';

export const unstable_instant = { prefetch: 'static' };

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
