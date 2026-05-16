export interface UsersDirectory {
    users: UsersApiResponse[];
    pagination: UsersPagination;
};

export interface UsersApiResponse {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    kycStatus?: string;
    kycSubmittedAt?: string;
    kycVerifiedAt?: string;
    createdAt: string;
};

export interface UsersPagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface UsersDetailsDirectory {
    users: UsersApiResponse;
    kyc: kycDetailsResponse;
    kycStatus: string;
};

export interface AdminKycDetailsResponse {
    user: AdminKycUserDetails;
    kyc: kycDetailsResponse;
    kycStatus: string;
};

export interface AdminKycUserDetails {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
};

export interface kycDetailsResponse {
    id: string;
    identificationType: string;
    identificationNumber: string;
    idDocumentUrl: string;
    selfieImageUrl: string;
    status: string;
    rejectionReason?: string;
    submittedAt: string;
    verifiedAt?: string;
    verifiedBy?: string;
};

export interface kycSubmissionResponse {
    kycId: string;
    status: string;
    rejectionReason?: string;
    verifiedAt?: string;
    verifiedBy?: string;
};

export interface kycPayload {
    kycId: string;
    rejectionReason?: string;
};

export interface FarmCategoryPayload {
    name: string;
    description?: string;
}

export interface MilestonePayload {
    name: string;
    order?: number;
}

export interface MilestoneBulkPayload {
    milestones: MilestonePayload[];
}

export interface DeleteResourceResponse {
    id?: string;
    categoryId?: string;
    deletedCount?: number;
}