import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from './providers/query-provider'
import Sidebar from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Acres AI',
  description: 'Real estate investment analysis and underwriting tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}