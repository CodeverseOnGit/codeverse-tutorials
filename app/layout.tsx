import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Codeverse — Cloud Native Developer Path',
  description: 'A project-based path from Linux fundamentals to a production-grade cloud native capstone.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
