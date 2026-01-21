'use client'

import { useState, useEffect } from 'react';
import { 
  Table, 
  Pagination, 
  SearchInput, 
  Typography,
  KycStatusBadge
} from '@/components/ui';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { Column } from '@/components/ui/table';
import { MoreIcon } from '@/components/icons';
import { useGetUsers } from '@/mutation';
import { UsersApiResponse } from '@/types';

const UsersDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetUsers({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: debouncedSearch,
  });

  const columns: Column<UsersApiResponse>[] = [
    {
        header: 'Name',
        key: 'name',
        render: (user) => (
          <span className="font-medium text-gray-900">{user.fullName}</span>
        ),
      },
      {
      header: 'KYC Status',
      key: 'kycStatus',
      render: (user) => (
         <KycStatusBadge status={user.kycStatus} />
        ),
      },
      {
        header: 'Phone No',
        key: 'phoneNumber',
      },
      {
        header: 'Email address',
        key: 'email',
      },
      {
        header: '',
        key: 'actions',
        render: () => (
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreIcon size={20} />
          </button>
        ),
    },
  ];

  return (
    <>
      <Typography variant='subheading' className='uppercase'>Users</Typography>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm mt-9">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {data?.data?.pagination?.totalUsers || 0} users
            </span>
          </div>
          
          <SearchInput 
            id="search-users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Users"
            containerClassName="w-full md:w-80"
          />
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-gray-500">Loading users...</div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={data?.data?.users || []} 
            />
            <Pagination 
              currentPage={page}
              totalPages={data?.data?.pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UsersDashboard;
