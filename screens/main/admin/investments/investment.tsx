'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Column } from '@/components/ui/table';
import { Table, SearchInput, Select } from '@/components/ui';
import { DownloadIcon, MoreIcon, CalendarIcon, ChevronIcon, ArrowLeftIcon } from '@/components/icons';
import { SelectOptions, UserInvestmentItem } from '@/types';
import { useGetUserInvestments } from '@/mutation';
import { formatNumberWithCommas, truncateMiddle } from '@/utils';

const ITEMS_PER_PAGE = 10;

interface ActionCellProps {
  record: UserInvestmentItem;
}

const ActionCell = ({ record }: ActionCellProps) => {
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
      if (target.closest('[data-dropdown-portal]')) {
        return;
      }
      setIsOpen(false);
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 140 + window.scrollX,
      });
    }
  }, [isOpen]);

  const handleExportSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);

    const rawId = record.displayId || record.id;
    const displayId = truncateMiddle(rawId, 4, 4);
    const investor = record.investorName || record.user?.fullName || record.user?.name || 'N/A';
    const farm = record.farmLine1 || record.farmName || record.farm?.name || 'N/A';
    const amount = typeof record.amountInvested === 'number'
      ? `₦${formatNumberWithCommas(record.amountInvested)}`
      : record.amountInvested || (record.amount ? `₦${formatNumberWithCommas(record.amount)}` : '₦0');
    const maturity = record.maturityDate || 'N/A';
    const duration = record.durationText || (typeof record.duration === 'string' ? record.duration : record.duration?.label || '');
    const status = record.status;

    const csvRows = [
      ['Field', 'Details'],
      ['Investment ID', rawId],
      ['Investor', investor],
      ['Farm', farm],
      ['Amount Invested', amount],
      ['Maturity Date', maturity],
      ['Duration', duration],
      ['Investment Status', status],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investment-summary-${displayId}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported summary for ${displayId}`);
  };

  const portalContainer = typeof document !== 'undefined' ? document.body : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 cursor-pointer flex items-center justify-center"
      >
        <MoreIcon size={20} />
      </button>

      {isOpen &&
        portalContainer &&
        createPortal(
          <div
            data-dropdown-portal="true"
            style={{
              position: 'absolute',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="w-40 bg-white border border-[#EAECF0] rounded-xl shadow-lg py-1.5 z-[9999] text-left flex flex-col"
          >
            <button
              type="button"
              onClick={handleExportSummary}
              className="w-full text-left px-4 py-2 text-sm text-[#344054] hover:bg-gray-50 transition-colors font-medium cursor-pointer block whitespace-nowrap"
            >
              Export Summary
            </button>
          </div>,
          portalContainer
        )}
    </div>
  );
};

const formatMaturityDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  const trimmed = dateStr.trim();

  const formattedMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3}),?\s+(\d{4})$/);
  if (formattedMatch) {
    return `${formattedMatch[1]} ${formattedMatch[2]}, ${formattedMatch[3]}`;
  }

  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const monthIdx = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (months[monthIdx]) {
      return `${day} ${months[monthIdx]}, ${year}`;
    }
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  return dateStr;
};

const calculateDateDuration = (startDateStr?: string, endDateStr?: string): string => {
  if (!startDateStr || !endDateStr) return '';

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let totalMonths = years * 12 + months;

  if (end.getDate() < start.getDate()) {
    totalMonths--;
  }

  if (totalMonths >= 1) {
    return `${totalMonths} ${totalMonths === 1 ? 'Month' : 'Months'}`;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
  }

  return '';
};

const getDurationText = (item: UserInvestmentItem): string => {
  const startDateStr = item.startDate || item.createdAt;
  const endDateStr = item.maturityDate || item.rawMaturityDate || item.endDate;

  const computedDuration = calculateDateDuration(startDateStr, endDateStr);
  if (computedDuration) {
    return computedDuration;
  }

  if (item.durationText) return item.durationText;
  if (typeof item.duration === 'string') return item.duration;
  if (item.duration?.label) return item.duration.label;
  if (item.durationValue && item.durationUnit) {
    const unit = item.durationUnit.toLowerCase();
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const isPlural = item.durationValue > 1 && !capitalizedUnit.endsWith('s');
    return `${item.durationValue} ${capitalizedUnit}${isPlural ? 's' : ''}`;
  }
  if (item.duration?.value && item.duration?.unit) {
    const unit = item.duration.unit.toLowerCase();
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const isPlural = item.duration.value > 1 && !capitalizedUnit.endsWith('s');
    return `${item.duration.value} ${capitalizedUnit}${isPlural ? 's' : ''}`;
  }
  return '';
};

export default function InvestmentDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rawDateFilter, setRawDateFilter] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch investments data from API
  const { data: investmentsResponse, isLoading } = useGetUserInvestments({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    maturityFrom: rawDateFilter || undefined,
  });

  const investmentsList = useMemo<UserInvestmentItem[]>(() => {
    const data = investmentsResponse?.data;
    if (!data) return [];
    if (Array.isArray(data.userInvestments)) return data.userInvestments;
    if (Array.isArray(data.investments)) return data.investments;
    if (Array.isArray(data)) return data;
    return [];
  }, [investmentsResponse]);

  const pagination = investmentsResponse?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalInvestments ?? pagination?.totalUsers ?? pagination?.totalItems ?? pagination?.total ?? investmentsList.length;

  const handleOpenDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;

    try {
      const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
      if (pickerInput.showPicker) {
        pickerInput.showPicker();
      } else {
        input.focus();
        input.click();
      }
    } catch {
      input.focus();
      input.click();
    }
  };

  // Compute formatted label for Maturity Date filter button
  const displayDateLabel = useMemo(() => {
    if (!rawDateFilter) return 'Maturity Date';
    const parts = rawDateFilter.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (months[monthIdx]) {
        return `${day} ${months[monthIdx]}, ${year}`;
      }
    }
    return rawDateFilter;
  }, [rawDateFilter]);

  const statusOptions: SelectOptions[] = [
    { label: 'Investment Status', value: '' },
    { label: 'Not Started', value: 'not_started' },
    { label: 'Funding in Progress', value: 'funding_started' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const handleDownload = () => {
    if (!investmentsList.length) {
      toast.error('No investments to download');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Investor,Farm,Amount Invested,Maturity Date,Status']
        .concat(
          investmentsList.map((i) => {
            const displayId = i.displayId || i.id;
            const investor = i.investorName || i.user?.fullName || i.user?.name || 'N/A';
            const farm = i.farmLine1 || i.farmName || i.farm?.name || 'N/A';
            const amount = typeof i.amountInvested === 'number' ? `₦${formatNumberWithCommas(i.amountInvested)}` : i.amountInvested || (i.amount ? `₦${formatNumberWithCommas(i.amount)}` : '₦0');
            const maturity = i.maturityDate || 'N/A';
            const duration = i.durationText || (typeof i.duration === 'string' ? i.duration : i.duration?.label || '');
            return `"${displayId}","${investor}","${farm}","${amount}","${maturity} (${duration})","${i.status}"`;
          })
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investments-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Investments downloaded successfully');
  };

  const columns: Column<UserInvestmentItem>[] = [
    {
      header: 'ID',
      key: 'id',
      render: (item) => {
        const rawId = item.displayId || item.id;
        return (
          <span className="text-[#667085] font-normal text-sm" title={rawId}>
            {truncateMiddle(rawId, 4, 4)}
          </span>
        );
      },
    },
    {
      header: 'Investor',
      key: 'investorName',
      render: (item) => (
        <span className="font-medium text-[#101828] text-sm">
          {item.investorName || item.user?.fullName || item.user?.name || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Farm',
      key: 'farmName',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#101828] text-sm">
            {item.farmLine1 || item.farmName || item.farm?.name || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount Invested',
      key: 'amountInvested',
      render: (item) => {
        let formattedAmount = '₦0.00';
        if (typeof item.amountInvested === 'number') {
          formattedAmount = `₦${formatNumberWithCommas(item.amountInvested)}`;
        } else if (typeof item.amountInvested === 'string' && item.amountInvested) {
          formattedAmount = item.amountInvested.startsWith('₦') ? item.amountInvested : `₦${item.amountInvested}`;
        } else if (item.amount) {
          formattedAmount = `₦${formatNumberWithCommas(item.amount)}`;
        }
        return <span className="font-medium text-[#101828] text-sm">{formattedAmount}</span>;
      },
    },
    {
      header: 'Maturity Date',
      key: 'maturityDate',
      render: (item) => {
        const rawDate = item.maturityDate || item.rawMaturityDate || item.endDate;
        const formattedDate = formatMaturityDate(rawDate);
        const duration = getDurationText(item);

        return (
          <div className="flex flex-col">
            <span className="font-semibold text-[#101828] text-sm">{formattedDate}</span>
            {duration && <span className="text-xs font-normal text-[#667085]">{duration}</span>}
          </div>
        );
      },
    },
    {
      header: 'Investment Status',
      key: 'status',
      render: (item) => {
        const statusLower = (item.status || '').toLowerCase();
        const isFunding = statusLower === 'funding_started' || statusLower === 'funding in progress';
        const isCompleted = statusLower === 'completed';
        const isActive = statusLower === 'active';
        
        let label = item.status;
        if (statusLower === 'funding_started') label = 'Funding in Progress';
        else if (statusLower === 'not_started') label = 'Not Started';
        else if (statusLower === 'active') label = 'Active';
        else if (statusLower === 'completed') label = 'Completed';

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              isFunding
                ? 'bg-[#FFFAEB] text-[#B54708]'
                : isCompleted
                ? 'bg-gray-100 text-gray-700'
                : isActive
                ? 'bg-[#ECFDF5] text-[#027A48]'
                : 'bg-[#F2F4F7] text-[#344054]'
            }`}
          >
            {label}
          </span>
        );
      },
    },
    {
      header: 'Action',
      key: 'action',
      render: (item) => <ActionCell record={item} />,
    },
  ];

  return (
    <div className="-m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-[#F2F8F2]">
      {/* Outer White Card Container */}
      <div className="bg-white rounded-2xl border border-white/80 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
        {/* Page Title & Download Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#101828]">Investments</h1>
            <span className="rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#137333]">
              {totalItems} Investments
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 py-2 text-sm font-semibold text-[#344054] shadow-xs transition-colors hover:bg-gray-50 cursor-pointer self-start sm:self-auto"
          >
            <DownloadIcon size={18} color="#344054" />
            <span>Download</span>
          </button>
        </div>

        {/* Sub-card Container for Search, Filters, Table & Pagination */}
        <div className="rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
          {/* Search & Filter Header Toolbar */}
          <div className="p-4 sm:p-5 border-b border-[#EAECF0] bg-white flex flex-col md:flex-row md:items-center justify-end gap-3">
            {/* Search Box */}
            <div className="w-full md:w-80">
              <SearchInput
                id="search-investments"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Investments"
                containerClassName="w-full"
                className="border-[#D0D5DD] bg-white text-sm placeholder:text-[#667085]"
              />
            </div>

            {/* Investment Status Select Dropdown */}
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="Investment Status"
                className="w-full rounded-lg border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-medium text-[#344054]"
              />
            </div>

            {/* Maturity Date Filter Control */}
            <div className="relative inline-block w-full sm:w-48">
              <button
                type="button"
                onClick={handleOpenDatePicker}
                className="w-full flex items-center justify-between rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-medium text-[#344054] cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CalendarIcon size={18} color="#667085" className="flex-shrink-0" />
                  <span className="text-sm font-medium text-[#344054] truncate">{displayDateLabel}</span>
                </div>
                <ChevronIcon size={16} color="#667085" className="flex-shrink-0" />
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={rawDateFilter}
                className="sr-only"
                onChange={(e) => {
                  setRawDateFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Table Content Area */}
          <div className="py-4 md:py-6">
            {/* Projects Sub-Badge & Clear Date Action */}
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-block rounded-full bg-[#E6F4EA] ml-4 md:ml-6 px-3 py-1 text-xs font-semibold text-[#137333]">
                {totalItems} Projects
              </span>
              {rawDateFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setRawDateFilter('');
                    setPage(1);
                  }}
                  className="text-xs text-red-600 hover:underline font-medium cursor-pointer mr-6"
                >
                  Clear Date Filter
                </button>
              )}
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="p-12 text-center text-[#667085] text-sm">
                Loading investments...
              </div>
            ) : investmentsList.length === 0 ? (
              <div className="p-12 text-center text-[#667085] text-sm">
                No user investments found.
              </div>
            ) : (
              <Table
                columns={columns}
                data={investmentsList}
                className="overflow-visible"
              />
            )}
          </div>

          {/* Custom Pagination Footer matching design */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAECF0] bg-white">
            <button
              type="button"
              disabled={page === 1 || isLoading}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#667085] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeftIcon size={16} color="#667085" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    page === pageNum
                      ? 'bg-[#F9F5FF] text-[#6941C6]'
                      : 'text-[#667085] hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#667085] bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
            >
              Next
              <ArrowLeftIcon size={16} color="#667085" className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
