'use client'

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Table, Pagination, SearchInput, Typography } from '@/components/ui';
import { Column } from '@/components/ui/table';
import { MoreIcon, DownloadIcon, ArrowDownIcon } from '@/components/icons';
import { useGetBetaSignups } from '@/mutation';
import { downloadBetaSignups } from '@/api';
import { BetaSignup } from '@/types';

const ITEMS_PER_PAGE = 10;

interface ActionCellProps {
  signup: BetaSignup;
  onCopyEmail: () => void;
  onRemoveEmail: () => void;
}

const ActionCell = ({ onCopyEmail, onRemoveEmail }: ActionCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest("[data-dropdown-portal]")) {
        return;
      }
      setIsOpen(false);
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 144 + window.scrollX
      });
    }
  }, [isOpen]);

  const portalContainer = typeof document !== "undefined" ? document.body : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer flex items-center justify-center"
        aria-label="Actions menu"
      >
        <MoreIcon size={20} />
      </button>

      {isOpen && portalContainer && createPortal(
        <div
          data-dropdown-portal="true"
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          className="w-36 bg-white border border-[#E4E7EC] rounded-lg shadow-lg py-1 z-[9999] animate-fadeIn text-left flex flex-col min-w-[140px]"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onCopyEmail();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors font-normal cursor-pointer block whitespace-nowrap"
          >
            Copy Email
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onRemoveEmail();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors font-normal cursor-pointer block whitespace-nowrap"
          >
            Remove
          </button>
        </div>,
        portalContainer
      )}
    </div>
  );
};

const MarketingDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch signups using the live React Query hook
  const { data, isLoading } = useGetBetaSignups({
    page,
    limit: ITEMS_PER_PAGE,
    query: search.trim() || undefined,
  });

  const signupsList = data?.data?.signups || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const totalItems = data?.data?.pagination?.totalItems || 0;

  // Checkbox handlers
  const isAllSelected =
    signupsList.length > 0 &&
    signupsList.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = signupsList.map((i) => i.id);
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = signupsList.map((i) => i.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // CSV Download handler using backend stream
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const csvBlob = await downloadBetaSignups(search.trim() || undefined);

      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `beta_signups_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Beta signups CSV exported successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to download CSV');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied ${email} to clipboard`);
  };

  // Columns definition using exact admin Table component structure
  const columns: Column<BetaSignup>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      ),
      key: 'checkbox',
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      ),
    },
    {
      header: (
        <div className="flex items-center gap-1.5 cursor-pointer select-none">
          <span>Email address</span>
          <ArrowDownIcon size={14} color="#667085" />
        </div>
      ),
      key: 'email',
      render: (item) => (
        <span className="font-medium text-gray-900">{item.email}</span>
      ),
    },
    {
      header: '',
      key: 'actions',
      render: (item) => (
        <div className="flex justify-end">
          <ActionCell
            signup={item}
            onCopyEmail={() => handleCopyEmail(item.email)}
            onRemoveEmail={() => toast.success(`Removed ${item.email}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Typography variant="subheading" className="uppercasel">
        USER EMAILS
      </Typography>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm mt-6">
        {/* Card Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Emails</h2>
            <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {totalItems} emails
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <SearchInput
              id="search-users"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Users"
              containerClassName="w-full sm:w-72"
            />

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-[#4a8929] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
            >
              <DownloadIcon size={18} color="#FFFFFF" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Admin Table Component */}
        <Table
          columns={columns}
          data={signupsList}
          className="overflow-visible"
        />

        {/* Admin Pagination Component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default MarketingDashboard;
