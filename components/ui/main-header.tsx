'use client'

import { useState } from "react";
import Link from "next/link";
import { BellIcon, LogoIcon } from "@/components/icons";
import ProfileMenu from "./profile-menu";

type MainHeaderProps = {
  activeTab?: "dashboard" | "my-farms" | "invest" | "my-portfolio";
};

const MainHeader = ({ activeTab }: MainHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabClassName = (tab: NonNullable<MainHeaderProps["activeTab"]>, isMobile = false) => {
    if (isMobile) {
      return `block px-4 py-3 text-base font-semibold border-l-4 transition-colors ${
        activeTab === tab
          ? "border-primary bg-primary/10 text-primary"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-955"
      }`;
    }
    return `flex items-center px-2 pb-1 border-b-2 text-sm font-medium transition-colors ${
      activeTab === tab ? "border-[#111827] text-[#111827]" : "border-transparent text-[#111827]"
    }`;
  };

  return (
    <header className="w-full border-y border-[#E5E7EB] bg-white relative z-50">
      <div className="mx-auto flex w-full max-w-7xl justify-between items-center px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" aria-label="SmileAgrimarket Dashboard" className="inline-flex items-center py-4">
          <LogoIcon className="h-11 w-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 self-stretch" aria-label="Main dashboard navigation">
          <Link href="/dashboard" className={tabClassName("dashboard")} aria-current={activeTab === "dashboard" ? "page" : undefined}>
            <div className="flex items-center gap-1">Dashboard</div>
          </Link>
          <Link href="/invest" className={tabClassName("invest")} aria-current={activeTab === "invest" ? "page" : undefined}>
            Invest
          </Link>
          <Link href="/my-farms" className={tabClassName("my-farms")} aria-current={activeTab === "my-farms" ? "page" : undefined}>
            My Farms
          </Link>
          <Link href="/my-portfolio" className={tabClassName("my-portfolio")} aria-current={activeTab === "my-portfolio" ? "page" : undefined}>
            My Portfolio
          </Link>
        </nav>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-3 md:gap-5 py-4">
          <button
            type="button"
            className="rounded-md text-[#9CA3AF] transition hover:text-[#6B7280]"
            aria-label="Notifications"
          >
            <BellIcon size={24} color="currentColor" strokeWidth={2.2} />
          </button>
          
          <ProfileMenu logoutRedirectPath="/login" />

          {/* Hamburger Menu Toggle for Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none md:hidden transition-colors"
            aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white shadow-lg absolute top-full left-0 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="pt-2 pb-4 space-y-1" aria-label="Mobile main dashboard navigation">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={tabClassName("dashboard", true)}
              aria-current={activeTab === "dashboard" ? "page" : undefined}
            >
              Dashboard
            </Link>
            <Link
              href="/invest"
              onClick={() => setIsOpen(false)}
              className={tabClassName("invest", true)}
              aria-current={activeTab === "invest" ? "page" : undefined}
            >
              Invest
            </Link>
            <Link
              href="/my-farms"
              onClick={() => setIsOpen(false)}
              className={tabClassName("my-farms", true)}
              aria-current={activeTab === "my-farms" ? "page" : undefined}
            >
              My Farms
            </Link>
            <Link
              href="/my-portfolio"
              onClick={() => setIsOpen(false)}
              className={tabClassName("my-portfolio", true)}
              aria-current={activeTab === "my-portfolio" ? "page" : undefined}
            >
              My Portfolio
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
