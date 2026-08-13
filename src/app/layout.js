import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'

export const metadata = {
  title: 'JobReady — AI-Powered Job Platform for Freshers',
  description: 'Find funded startup jobs, tailor your resume with AI, check your ATS score, and stay updated with hiring news — all in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--bg-panel, white)',
            color: 'var(--ink, #0F172A)',
            border: '1px solid var(--border, #E2E8F0)',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            boxShadow: '0 4px 20px rgba(15,23,42,0.1)'
          },
          success: { iconTheme: { primary: '#16A34A', secondary: 'white' } },
          error: { iconTheme: { primary: '#DC2626', secondary: 'white' } },
        }} />
      </body>
    </html>
  )
}
