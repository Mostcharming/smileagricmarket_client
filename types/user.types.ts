export type KYCStatus = 'Active' | 'Unverified' | 'Pending' | 'Rejected';

export interface User {
  id: string;
  name: string;
  kycStatus: KYCStatus;
  phoneNo: string;
  email: string;
  nin?: string;
  verificationImage?: string;
}

export interface UserResponse {
  users: User[];
  totalUsers: number;
}
