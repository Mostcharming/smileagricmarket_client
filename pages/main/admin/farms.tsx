'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAdminFarms, useGetCategories } from '@/mutation';
import type { FarmCategoryResponse, FarmResponse, SelectOptions } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { Column } from '@/components/ui/table';
import { MoreIcon } from '@/components/icons';
import { FarmStatusBadge, Pagination, SearchInput, Select, Table, Typography } from '@/components/ui';

const buildStatusOptions = (): SelectOptions[] => [
  { label: 'Active', value: 'active' },
  { label: 'Unverified', value: 'unverified' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Inactive', value: 'inactive' },
];

const formatFarmStatus = (farm: FarmResponse) => {
  // Prefer the explicit verificationStatus when available (some API payloads include this)
  const explicitStatus = (farm as unknown as { verificationStatus?: string }).verificationStatus;
  if (explicitStatus) {
    const normalizedStatus = String(explicitStatus).toLowerCase();

    return normalizedStatus === 'approved' ? 'active' : normalizedStatus;
  }

  const rawStatus =
    farm.Investment?.status ||
    (farm.stats && typeof farm.stats.completionPercentage === 'number' && farm.stats.completionPercentage > 0
      ? 'active'
      : 'unverified');

  const normalizedStatus = String(rawStatus).toLowerCase();

  return normalizedStatus === 'approved' ? 'active' : normalizedStatus;
};

const formatFarmCategory = (farm: FarmResponse) => farm.Category?.name || 'Uncategorized';

const AdminFarmsDashboard = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: categoriesResponse } = useGetCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const categories = useMemo<FarmCategoryResponse[]>(() => {
    const categoryData = categoriesResponse?.data;

    if (Array.isArray(categoryData)) {
      return categoryData;
    }

    if (
      categoryData &&
      typeof categoryData === 'object' &&
      Array.isArray((categoryData as { categories?: FarmCategoryResponse[] }).categories)
    ) {
      return (categoryData as { categories: FarmCategoryResponse[] }).categories;
    }

    return [];
  }, [categoriesResponse?.data]);

  const categoryOptions: SelectOptions[] = useMemo(
    () => categories.map((category) => ({ label: category.name, value: category.id })),
    [categories]
  );

  const { data, isLoading } = useGetAdminFarms({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  });

  const farms = data?.data?.farms || [];
  const totalFarms = data?.data?.pagination?.total || 0;

  const columns: Column<FarmResponse>[] = [
    {
      header: 'Farm Name',
      key: 'name',
      render: (farm) => <span className="font-medium text-[#1F2937]">{farm.name}</span>,
    },
    {
      header: 'Verification Status',
      key: 'status',
      render: (farm) => <FarmStatusBadge status={formatFarmStatus(farm)} />,
    },
    {
      header: 'Address',
      key: 'location',
      render: (farm) => <span className="text-[#6B7280]">{farm.location || 'No address provided'}</span>,
    },
    {
      header: 'Farm Category',
      key: 'category',
      render: (farm) => <span className="text-[#4B5563]">{formatFarmCategory(farm)}</span>,
    },
    {
      header: '',
      key: 'actions',
      render: () => (
        <button type="button" className="text-[#9CA3AF] transition-colors hover:text-[#6B7280]">
          <MoreIcon size={20} />
        </button>
      ),
    },
  ];

  return (
    <>
      <Typography variant='subheading' className='uppercase'>Farms</Typography>

      <section className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.06)] mt-9">
        <div className="flex flex-col gap-4 border-b border-[#EEF0F2] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#1F2937]">Farms</h2>
            <span className="rounded-full bg-[#EEEAFB] px-3 py-1 text-xs font-medium text-[#6A53C8]">
              {totalFarms} Farms
            </span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              id="search-farms"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Farms"
              containerClassName="w-full lg:w-[260px]"
              className="border-[#C9CDD3] bg-transparent"
            />

            <Select
              options={buildStatusOptions()}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              placeholder="Verification Status"
              className="min-w-[190px] rounded-lg border-[#D7D9DE] bg-white px-4 py-3 text-sm"
            />

            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setPage(1);
              }}
              placeholder="Farm Category"
              className="min-w-[180px] rounded-lg border-[#D7D9DE] bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-[#6B7280]">Loading farms...</div>
        ) : (
          <>
            <Table columns={columns} data={farms} className="overflow-visible" onRowClick={(farm) => router.push(`/admin/farms/${farm.id}`)} />
            <Pagination
              currentPage={page}
              totalPages={data?.data?.pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
};

export default AdminFarmsDashboard;