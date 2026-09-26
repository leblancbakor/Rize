import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rize',
  description: 'Sell anything in Discord. Get paid in crypto or card without leaving the server.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#0b0b0f',
          color: '#f4f4f5',
        }}
      >
        {children}
      </body>
    </html>
  );
}
