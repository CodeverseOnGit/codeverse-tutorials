'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/cloud-native-development/api/auth">
      {children}
    </SessionProvider>
  );
}