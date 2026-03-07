'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import { BellIcon, SearchIcon } from '../icons';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: string[];
}

const AdminLayout = ({ children, breadcrumbs = [] }: AdminLayoutProps) => {
  const pathname = usePathname();
  const isMilestonesPage = pathname === '/admin/milestones';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && <span className="text-gray-400">{'>'}</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pr-10 pl-4 py-2 border-b border-border text-sm outline-none w-64 transition-all"
              />
              <SearchIcon size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-border" />
            </div>
            
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon size={24} className='text-border' />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                OP
              </div>
            </div>
          </div>
        </header>

        <main className={isMilestonesPage ? 'p-0' : 'p-8'}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
