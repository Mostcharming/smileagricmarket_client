'use client'

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { 
  Table, 
  Pagination, 
  SearchInput, 
  Typography,
  KycStatusBadge,
  Select
} from '@/components/ui';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { Column } from '@/components/ui/table';
import { MoreIcon, CloseIcon, CopyIcon } from '@/components/icons';
import { Modal } from '@/components/modal';
import { useGetUsers } from '@/mutation';
import { UsersApiResponse, SelectOptions } from '@/types';

interface ActionCellProps {
  user: UsersApiResponse;
  onViewProfile: () => void;
}

const ActionCell = ({ user, onViewProfile }: ActionCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 focus:outline-none cursor-pointer"
      >
        <MoreIcon size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-[#E4E7EC] rounded-lg shadow-lg py-1 z-50 animate-fadeIn">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onViewProfile();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors font-normal cursor-pointer"
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
};

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UsersApiResponse | null;
}

const UserProfileModal = ({ isOpen, onClose, user }: UserProfileModalProps) => {
  if (!user) return null;

  const handleCopyNIN = () => {
    if (user.nin) {
      navigator.clipboard.writeText(user.nin);
      toast.success("NIN copied to clipboard");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="User Profile Modal"
      maxWidth="max-w-md"
    >
      <div className="relative p-6 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <CloseIcon size={24} />
        </button>

        <Typography variant="subheading" className="mb-6">
          {user.fullName}
        </Typography>

        <div className="relative w-32 h-32 mb-8">
          <img
            src={user.profileImageUrl || "/picture-preview.jpg"}
            alt={user.fullName}
            className="h-full w-full rounded-full border-4 border-gray-100 object-cover"
          />
        </div>

        {user.nin && (
          <div className="text-center mb-4">
            <Typography className="text-gray-500 mb-1">
              Identification Number (NIN)
            </Typography>
            <div className="flex items-center justify-center gap-2">
              <Typography className="text-gray-900 font-medium text-lg">
                {user.nin}
              </Typography>
              <button
                onClick={handleCopyNIN}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <CopyIcon size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const UsersDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState<UsersApiResponse | null>(null);

  const kycStatusOptions: SelectOptions[] = [
    { label: 'KYC Status', value: '' },
    { label: 'Active', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Unverified', value: 'not_submitted' },
  ];

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
    kycStatus: kycStatus || undefined,
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
        render: (user) => (
          <ActionCell 
            user={user} 
            onViewProfile={() => {
              setSelectedUser(user);
            }} 
          />
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
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <SearchInput 
              id="search-users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Users"
              containerClassName="w-full md:w-80"
            />
            <Select
              options={kycStatusOptions}
              value={kycStatus}
              onChange={(e) => {
                setKycStatus(e.target.value);
                setPage(1);
              }}
              placeholder="KYC Status"
              className="w-full sm:w-[180px] rounded-lg border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-gray-500">Loading users...</div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={data?.data?.users || []} 
              className="overflow-visible"
            />
            <Pagination 
              currentPage={page}
              totalPages={data?.data?.pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <UserProfileModal 
        isOpen={selectedUser !== null}
        onClose={() => {
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
};

export default UsersDashboard;
