'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Home, Map } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Acres AI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/macro"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/macro'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Macro</span>
            </Link>
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}