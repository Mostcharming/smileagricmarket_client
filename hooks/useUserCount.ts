'use client'

import { useGetUsers } from '@/mutation';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export const useUserCount = () => {
  const { data } = useGetUsers({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    search: '',
  });

  return data?.data?.pagination?.totalUsers || 0;
};
