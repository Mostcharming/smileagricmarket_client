'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UsersIcon, ChevronIcon, LogoIcon } from '../icons';

interface MarketingSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MarketingSidebar = ({ isOpen = false, onClose }: MarketingSidebarProps) => {
  const pathname = usePathname() ?? '';
  const [usersOpen, setUsersOpen] = useState(
    pathname.includes('/marketing')
  );

  const isActive = (path: string) =>
    pathname === path || (path === '/marketing/dashboard' && pathname === '/marketing/beta-email') || (path === '/marketing/beta-email' && pathname === '/marketing/dashboard');

  return (
    <aside className={`w-full md:w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-2">
            <LogoIcon size={32} />
            <span className="font-bold text-lg text-gray-900">SmileAgrimarket</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 text-gray-500 hover:text-gray-900 rounded-md focus:outline-none transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <nav className="space-y-1">
          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                pathname.includes('/marketing') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <UsersIcon size={20} />
                <span className="font-medium text-sm">Users</span>
              </div>
              <ChevronIcon 
                size={16} 
                className={`transition-transform ${usersOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {usersOpen && (
              <div className="mt-1 space-y-1">
                <Link
                  href="/marketing/dashboard"
                  onClick={onClose}
                  className={`flex items-center justify-between pl-7 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/marketing/dashboard') ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">Beta Email</span>
                  {isActive('/marketing/dashboard') && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">1210</span>
                    </div>
                  )}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default MarketingSidebar;
