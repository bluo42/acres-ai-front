'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Home, Map, PenTool } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Properties',
      href: '/',
      icon: Home,
    },
    {
      name: 'Macro',
      href: '/macro',
      icon: Map,
    },
    {
      name: 'ADU Planner',
      href: '/adu-planner',
      icon: PenTool,
    },
  ]

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Calculator className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">Acres AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}