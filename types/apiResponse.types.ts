export interface ApiResponse<T> {
    success: boolean;
    message: string;
    status: number;
    data: T;
}

export interface PaginatedFilter {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    filter?: string;
    sort?: string;
    category?: string;
    kycStatus?: string;
}

export interface ApiError {
    statusCode?: number;
    message: string;
    errors?: Record<string, unknown>;
    stack?: string;
}

export interface TokenResponse {
    token: string;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startIndex: number;
	endIndex: number;
}