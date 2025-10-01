import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import ConditionalBottomNav from '@/components/ui/ConditionalBottomNav';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krewbi - Plataforma de Gestión Empresarial",
  description: "Tu plataforma de gestión empresarial integral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen`}
      >
        <AuthProvider>
          <div className="max-w-[1000px] mx-auto">
            {children}
          </div>
          <ConditionalBottomNav />
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              padding: '16px 20px',
              backdropFilter: 'blur(8px)',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #EC0B43 0%, #D00A3A 100%)',
                color: 'white',
                border: 'none',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#EC0B43',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
