import type { profileSchema } from "./auth.types";

export interface WebProfilePayload {
  fullName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  bio: string;
}

export interface WebProfileWalletPayload {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface WebProfileWalletResponse extends WebProfileWalletPayload {
  id: string;
  userId: string;
  isVerified: boolean;
}

export interface WebProfileResponse extends profileSchema {
  bio?: string;
  profileImageUrl?: string;
  isPhoneVerified?: boolean;
  kycStatus?: string;
  kycInfo?: Record<string, unknown>;
  wallet?: WebProfileWalletResponse | Record<string, unknown>;
}

export interface WebProfileCompletionStatusResponse {
  completionPercentage: number;
  completionScore: string;
  missingFields: string[];
  profileStatus: Record<string, boolean>;
}

export interface BankDirectoryEntry {
  name: string;
  slug: string;
  code: string;
  ussd?: string;
  logo?: string;
}