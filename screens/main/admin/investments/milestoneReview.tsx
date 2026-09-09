'use client'

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Column } from '@/components/ui/table';
import { Table, SearchInput, Select } from '@/components/ui';
import { DownloadIcon, CalendarIcon, ChevronIcon, WalletIcon, FarmIcon, TrendingUpIcon } from '@/components/icons';
import { SelectOptions, UserInvestmentMilestoneItem, MetricTrend } from '@/types';
import { useGetUserInvestmentMilestones, useDownloadUserInvestmentMilestones } from '@/mutation';
import { formatNumberWithCommas } from '@/utils';

const ITEMS_PER_PAGE = 10;

const renderTrendBadge = (trend?: MetricTrend, defaultText: string = 'Summary') => {
  if (!trend || trend.displayChange === undefined) {
    return (
      <span className="text-xs font-semibold text-[#667085] flex items-center gap-1">
        <TrendingUpIcon size={14} color="#12B76A" />
        {defaultText}
      </span>
    );
  }

  const displayChange = trend.displayChange;
  const direction = (trend.direction || '').toLowerCase();

  const isPositivePrefix = typeof displayChange === 'string' && displayChange.trim().startsWith('+');
  const isNegativePrefix = typeof displayChange === 'string' && displayChange.trim().startsWith('-');

  const isUp = direction === 'up' || (trend.change !== undefined && trend.change > 0) || isPositivePrefix;
  const isDown = (direction === 'down' || (trend.change !== undefined && trend.change < 0) || isNegativePrefix) && !isPositivePrefix;

  if (isUp) {
    return (
      <span className="text-xs font-semibold flex items-center gap-1 text-[#12B76A]">
        <TrendingUpIcon size={14} color="#12B76A" />
        <span>{displayChange}</span>
      </span>
    );
  }

  if (isDown) {
    return (
      <span className="text-xs font-semibold flex items-center gap-1 text-[#F04438]">
        <TrendingUpIcon size={14} color="#F04438" className="rotate-180" />
        <span>{displayChange}</span>
      </span>
    );
  }

  // Neutral / No change: do not use a downward arrow
  return (
    <span className="text-xs font-semibold flex items-center gap-1 text-[#12B76A]">
      <TrendingUpIcon size={14} color="#12B76A" />
      <span>{displayChange}</span>
    </span>
  );
};

export default function MilestoneReviewDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [rawDateFilter, setRawDateFilter] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch live milestone reviews from GET /web/admin/user-investment-milestones
  const { data: milestonesResponse, isLoading } = useGetUserInvestmentMilestones({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    reviewStatus: statusFilter || undefined,
    farmCategoryId: cropFilter || undefined,
    dateFrom: rawDateFilter || undefined,
  });

  const downloadMutation = useDownloadUserInvestmentMilestones();

  const milestonesList = useMemo<UserInvestmentMilestoneItem[]>(() => {
    const data = milestonesResponse?.data;
    if (!data) return [];
    if (Array.isArray(data.milestones)) return data.milestones;
    if (Array.isArray(data.userInvestmentMilestones)) return data.userInvestmentMilestones;
    if (Array.isArray(data)) return data;
    return [];
  }, [milestonesResponse]);

  const responseData = milestonesResponse?.data;
  const summary = responseData?.summary;
  const metrics = responseData?.metrics || responseData?.summaryMetrics;
  const pagination = responseData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalMilestones ?? pagination?.totalItems ?? pagination?.total ?? milestonesList.length;

  const pendingReviewCount = summary?.pendingMilestones?.count ?? metrics?.pendingReviewCount ?? metrics?.milestonesPendingReview ?? milestonesList.filter(m => (m.reviewStatus || m.status) === 'pending' || (m.reviewStatus || m.status) === 'Pending Review').length;
  const totalDisbursed = summary?.totalDisbursed?.amount ?? metrics?.totalDisbursed ?? 0;
  const totalInEscrow = summary?.totalInEscrow?.amount ?? metrics?.totalInEscrow ?? 0;

  const pendingTrend = summary?.pendingMilestones?.trend;
  const disbursedTrend = summary?.totalDisbursed?.trend;
  const escrowTrend = summary?.totalInEscrow?.trend;

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

  const displayDateLabel = useMemo(() => {
    if (!rawDateFilter) return 'Submission Date';
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
    { label: 'Status', value: '' },
    { label: 'Pending Review', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'More Evidence Required', value: 'more_evidence_required' },
  ];

  const cropOptions: SelectOptions[] = [
    { label: 'Crop', value: '' },
    { label: 'Vegetable', value: 'Vegetable' },
    { label: 'Cassava', value: 'Cassava' },
    { label: 'Maize', value: 'Maize' },
  ];

  const handleDownload = async () => {
    try {
      toast.info('Preparing CSV download...');
      const blob = await downloadMutation.mutateAsync({
        search: debouncedSearch || undefined,
        reviewStatus: statusFilter || undefined,
        dateFrom: rawDateFilter || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `milestone-reviews-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Milestone review records downloaded successfully');
    } catch {
      // Fallback CSV generation if endpoint returns error or blob is empty
      if (!milestonesList.length) {
        toast.error('No milestone records to download');
        return;
      }

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['Farm,Farmer,Milestone,Category,Amount Requested,Submission Date,Status']
          .concat(
            milestonesList.map(
              (i) =>
                `"${i.farm?.name || i.farmName || 'N/A'}","${i.user?.fullName || i.farmerName || 'N/A'}","${i.milestone?.name || i.milestoneTitle || i.name || 'N/A'}","${i.farmCategory?.name || i.cropCategory || 'N/A'}","${formatAmountFormatted(i.amountRequested, i.currency === 'NGN' ? '₦' : i.currency || '₦')}","${formatDateFormatted(i.investmentProject?.maturityDate || i.investment?.maturityDate || i.submissionDate || i.rawDate)}","${i.reviewStatus || i.status || 'N/A'}"`
            )
          )
          .join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `milestone-reviews-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Milestone review records downloaded successfully');
    }
  };

  const formatDateFormatted = (dateInput?: string | Date | null): string => {
    if (!dateInput) return 'N/A';
    if (typeof dateInput === 'string') {
      const ymdMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (ymdMatch) {
        const year = ymdMatch[1];
        const monthIdx = parseInt(ymdMatch[2], 10) - 1;
        const day = parseInt(ymdMatch[3], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (months[monthIdx]) {
          return `${day} ${months[monthIdx]}, ${year}`;
        }
      }
    }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const formatAmountFormatted = (amountRequested?: number | string, currencySymbol = '₦') => {
    if (amountRequested === undefined || amountRequested === null || amountRequested === '') return `${currencySymbol}0.00`;
    let numVal: number;
    if (typeof amountRequested === 'number') {
      numVal = amountRequested;
    } else {
      const cleaned = String(amountRequested).replace(/[^0-9.-]/g, '');
      numVal = parseFloat(cleaned);
    }
    if (isNaN(numVal)) {
      return String(amountRequested);
    }
    return `${currencySymbol}${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns: Column<UserInvestmentMilestoneItem>[] = [
    {
      header: 'Farm',
      key: 'farmName',
      render: (item) => {
        const farmName = item.farm?.name || item.farmName || 'N/A';
        const farmerName = item.user?.fullName || item.farmerName || '';
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-[#101828] text-sm">{farmName}</span>
            {farmerName && <span className="text-xs text-[#667085] font-normal">{farmerName}</span>}
          </div>
        );
      },
    },
    {
      header: 'Milestone',
      key: 'milestoneTitle',
      render: (item) => {
        const milestoneName = item.milestone?.name || item.milestoneTitle || item.name || 'N/A';
        const categoryName = item.farmCategory?.name || item.cropCategory || '';
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-[#101828] text-sm">{milestoneName}</span>
            {categoryName && <span className="text-xs text-[#667085] font-normal">{categoryName}</span>}
          </div>
        );
      },
    },
    {
      header: 'Amount Requested',
      key: 'amountRequested',
      render: (item) => {
        const val = formatAmountFormatted(item.amountRequested, item.currency === 'NGN' ? '₦' : item.currency || '₦');
        return <span className="font-semibold text-[#101828] text-sm">{val}</span>;
      },
    },
    {
      header: 'Submission Date',
      key: 'submissionDate',
      render: (item) => {
        const dateVal = formatDateFormatted(
          item.investmentProject?.maturityDate || item.investment?.maturityDate || item.submissionDate || item.rawDate
        );
        return <span className="font-medium text-[#344054] text-sm">{dateVal}</span>;
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => {
        const rawStatus = (item.reviewStatus || item.status || '').toLowerCase();
        const isPending = rawStatus === 'pending' || rawStatus === 'pending review';
        const isApproved = rawStatus === 'approved' || rawStatus === 'complete';
        const isMoreEvidence = rawStatus === 'more_evidence_required' || rawStatus === 'in progress';
        const isRejected = rawStatus === 'rejected';

        let displayStatus = item.reviewStatus || item.status || 'Pending';
        if (rawStatus === 'pending') displayStatus = 'Pending Review';
        else if (rawStatus === 'approved') displayStatus = 'Approved';
        else if (rawStatus === 'more_evidence_required') displayStatus = 'More Evidence Required';
        else if (rawStatus === 'rejected') displayStatus = 'Rejected';

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              isPending
                ? 'bg-[#F2F4F7] text-[#344054]'
                : isApproved
                ? 'bg-[#ECFDF5] text-[#027A48]'
                : isMoreEvidence
                ? 'bg-[#FFFAEB] text-[#B54708]'
                : isRejected
                ? 'bg-[#FEF3F2] text-[#B42318]'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      header: 'Action',
      key: 'action',
      render: (item) => {
        const fs = (item.fundingStatus || '').toLowerCase();
        const isNotRequested = fs === 'not_requested';

        if (isNotRequested) {
          return (
            <span
              title="This milestone has not been requested for funding yet"
              className="text-gray-400 font-medium text-sm cursor-not-allowed opacity-50 select-none"
            >
              Review
            </span>
          );
        }

        return (
          <Link
            href={`/admin/investments/milestone-review/${item.milestoneId || item.id}`}
            className="text-[#6941C6] hover:text-[#53389E] font-semibold text-sm cursor-pointer transition-colors hover:underline"
          >
            Review
          </Link>
        );
      },
    },
  ];

  return (
    <div className="-m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-[#EBF5EB] space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Milestones Pending Review */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#EAF6EA] flex items-center justify-center text-[#2E7D32]">
              <FarmIcon size={20} color="#2E7D32" />
            </div>
            {renderTrendBadge(pendingTrend, 'Active Queue')}
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">{pendingReviewCount}</h2>
            <p className="text-xs font-medium text-[#667085]">Milestones Pending Review</p>
          </div>
        </div>

        {/* Card 2: Total Disbursed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#344054]">
              <WalletIcon size={20} color="#344054" />
            </div>
            {renderTrendBadge(disbursedTrend, 'Summary')}
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">
              ₦{formatNumberWithCommas(totalDisbursed)}
            </h2>
            <p className="text-xs font-medium text-[#667085]">Total Disbursed</p>
          </div>
        </div>

        {/* Card 3: Total in Escrow */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#344054]">
              <WalletIcon size={20} color="#344054" />
            </div>
            {renderTrendBadge(escrowTrend, 'Summary')}
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">
              ₦{formatNumberWithCommas(totalInEscrow)}
            </h2>
            <p className="text-xs font-medium text-[#667085]">Total in Escrow</p>
          </div>
        </div>
      </div>

      {/* Main Content Area Card */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-6 md:p-8 shadow-xs space-y-6">
        {/* Section Header & Download Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#101828]">Farm Milestones</h1>
            <span className="rounded-full bg-[#EAF6EA] px-3 py-1 text-xs font-medium text-[#2E7D32]">
              {totalItems} Milestones
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 py-2 text-sm font-semibold text-[#344054] shadow-xs transition-colors hover:bg-gray-50 cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <DownloadIcon size={18} color="#344054" />
            <span>{downloadMutation.isPending ? 'Downloading...' : 'Download'}</span>
          </button>
        </div>

        {/* Toolbar: Search, Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-3">
          {/* Search Box */}
          <div className="w-full md:w-80">
            <SearchInput
              id="search-milestones"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Investments"
              containerClassName="w-full"
              className="border-[#D0D5DD] bg-white text-sm placeholder:text-[#667085]"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Status"
              className="w-full rounded-lg border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-medium text-[#344054]"
            />
          </div>

          {/* Crop Filter */}
          <div className="w-full sm:w-36">
            <Select
              options={cropOptions}
              value={cropFilter}
              onChange={(e) => {
                setCropFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Crop"
              className="w-full rounded-lg border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-medium text-[#344054]"
            />
          </div>

          {/* Submission Date Filter */}
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
              onChange={(e) => {
                setRawDateFilter(e.target.value);
                setPage(1);
              }}
              className="sr-only absolute inset-0 opacity-0 pointer-events-auto"
              tabIndex={-1}
            />
          </div>
        </div>

        {/* Table Outer Card Container */}
        <div className="rounded-xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
          {/* Top Pill Header inside table border box */}
          <div className="px-5 py-3 border-b border-[#EAECF0] bg-white flex items-center justify-between">
            <span className="rounded-full bg-[#EAF6EA] px-2.5 py-1 text-xs font-medium text-[#2E7D32]">
              {totalItems} Milestones
            </span>
            {rawDateFilter && (
              <button
                type="button"
                onClick={() => {
                  setRawDateFilter('');
                  setPage(1);
                }}
                className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
              >
                Clear Date Filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#667085] text-sm">
              Loading milestone reviews...
            </div>
          ) : milestonesList.length === 0 ? (
            <div className="p-12 text-center text-[#667085] text-sm">
              No milestone funding requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                data={milestonesList}
                columns={columns}
                className="w-full"
              />
            </div>
          )}

          {/* Table Footer Pagination */}
          <div className="p-4 sm:p-5 border-t border-[#EAECF0] bg-white flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#D0D5DD] rounded-lg text-sm font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    page === p
                      ? 'bg-[#F4EBFF] text-[#6941C6]'
                      : 'text-[#667085] hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#D0D5DD] rounded-lg text-sm font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
