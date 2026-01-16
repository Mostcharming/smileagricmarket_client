'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, UsersIcon, ChevronIcon, LogoIcon } from '../icons';
import { useUserCount, useVerificationCount } from '@/hooks';

const Sidebar = () => {
  const pathname = usePathname() ?? '';
  const [usersOpen, setUsersOpen] = useState(true);
  const totalUsers = useUserCount();
  const totalVerification = useVerificationCount();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <LogoIcon size={32} />
          <span className="font-bold text-lg text-gray-900">SmileAgrimarket</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/admin/dashboard') ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <DashboardIcon size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                pathname.includes('/admin/users') || pathname.includes('/admin/verification') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'
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
                  href="/admin/users"
                  className={`flex items-center justify-between pl-7 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/users') ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">Users</span>
                  {isActive('/admin/users') && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{totalUsers}</span>
                    </div>
                  )}
                </Link>
                <Link
                  href="/admin/verification"
                  className={`flex items-center justify-between pl-7 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/verification') ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">Verification</span>
                  {isActive('/admin/verification') && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{totalVerification}</span>
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

export default Sidebar;
