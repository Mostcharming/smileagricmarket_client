'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import { BellIcon, SearchIcon } from '../icons';
import ProfileMenu from './profile-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: string[];
}

const AdminLayout = ({ children, breadcrumbs = [] }: AdminLayoutProps) => {
  const pathname = usePathname();
  const isFullWidthPage = pathname === '/admin/milestones' || pathname === '/admin/investments/templates';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Admin Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3 text-sm">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs for desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                    {crumb}
                  </span>
                  {index < breadcrumbs.length - 1 && <span className="text-gray-400">{'>'}</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Title for mobile */}
            {breadcrumbs.length > 0 && (
              <span className="sm:hidden text-gray-950 font-bold text-base truncate max-w-[150px]">
                {breadcrumbs[breadcrumbs.length - 1]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="pr-10 pl-4 py-2 border-b border-border text-sm outline-none w-48 lg:w-64 focus:border-primary transition-all"
              />
              <SearchIcon size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-border" />
            </div>
            
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
              <BellIcon size={24} className="text-border" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <ProfileMenu logoutRedirectPath="/admin" />
          </div>
        </header>

        <main className={isFullWidthPage ? 'p-0' : 'p-4 md:p-8'}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
