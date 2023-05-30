import './globals.css'
import { Inter } from 'next/font/google'
import AuthContext from './context/AuthContext'
import ToastContext from './context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next - Messenger',
  description: 'Next gen. Messenger app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToastContext />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
