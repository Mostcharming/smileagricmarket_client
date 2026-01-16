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
    filter?: string;
    sort?: string;
    category?: string;
    status?: string;
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