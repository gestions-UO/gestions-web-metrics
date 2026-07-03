import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Gestions Web Metrics',
  description: 'Minimalist Web Metrics Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#fdfcfb] text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white min-h-screen">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#171717',
              border: '1px solid #e5e5e5',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              fontFamily: 'var(--font-inter)'
            }
          }}
        />
      </body>
    </html>
  );
}
