export interface MarketingAdmin {
    id: string;
    fullName: string;
    email: string;
    role: string;
    lastLoginAt: string;
}

export interface MarketingLoginResponse {
    token: string;
    marketingAdmin: MarketingAdmin;
}

export interface BetaSignup {
    id: string;
    email: string;
    firstName: string;
    source: string;
    confirmationEmailSentAt: string | null;
    createdAt: string;
}

export interface BetaSignupPayload {
    email: string;
    firstName: string;
}

export interface BetaSignupsPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BetaSignupsResponse {
    signups: BetaSignup[];
    pagination: BetaSignupsPagination;
}

export interface BetaSignupsFilter {
    page?: number;
    limit?: number;
    query?: string;
}
