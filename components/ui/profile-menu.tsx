'use client'

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { getStoredUser, signOut } from "@/utils";
import { profileSchema } from "@/types";

type ProfileMenuProps = {
  logoutRedirectPath: string;
  className?: string;
};

const getInitialsFromFullName = (fullName?: string) => {
  const cleanedName = fullName?.trim();

  if (!cleanedName) {
    return "SA";
  }

  const nameParts = cleanedName.split(/\s+/).filter(Boolean);
  return nameParts.length === 1
    ? nameParts[0].slice(0, 2).toUpperCase()
    : `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
};

const ProfileMenu = ({ logoutRedirectPath, className = "" }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<profileSchema | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateUser = () => {
      setUser(getStoredUser());
    };

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("storage", updateUser);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initials = getInitialsFromFullName(user?.fullName);
  const displayName = user?.fullName || "My profile";
  const displayEmail = user?.email || "Account settings";

  return (
    <div ref={menuRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full outline-none"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D1D5DB] text-base font-medium text-white">
          {initials}
        </div>
        <ChevronIcon
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#111827]">{displayName}</p>
            <p className="mt-1 truncate text-xs text-[#6B7280]">{displayEmail}</p>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#374151] transition-colors hover:bg-[#F3F4F6]"
            >
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => signOut(logoutRedirectPath)}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#B42318] transition-colors hover:bg-[#FEF3F2]"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;