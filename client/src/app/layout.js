import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title:       'TaskFlow — Modern Task Management',
  description: 'Organize, track, and manage tasks efficiently with TaskFlow. Beautiful dark UI, analytics, and seamless collaboration.',
  keywords:    'task management, todo, productivity, project management',
};

export const viewport = {
  width:        'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-dark-900 text-white min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background:   'rgba(15, 23, 42, 0.95)',
              color:        '#F8FAFC',
              border:       '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              padding:      '12px 16px',
              fontSize:     '14px',
              fontFamily:   'Inter, sans-serif',
              boxShadow:    '0 20px 40px rgba(0,0,0,0.3)',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#F8FAFC' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#F8FAFC' } },
          }}
        />
      </body>
    </html>
  );
}
