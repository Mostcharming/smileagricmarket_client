import { adminUrl } from "@/constants";
import { buildQueryString, get, post } from "@/utils";
import { ApiResponse, kycPayload, kycSubmissionResponse, PaginatedFilter, UsersDetailsDirectory, UsersDirectory } from "@/types";

export const getUsers = async (
    filter: PaginatedFilter
): Promise<ApiResponse<UsersDirectory>> => {
    const query = buildQueryString(filter);
    const response = await get<UsersDirectory>(adminUrl.getUsers(query));
    return response;
};

export const getUserDetails = async (userId: string) => {
    const response = await get<UsersDetailsDirectory>(
        adminUrl.getKycDetails(userId)
    );
    return response.data;
};

export const approveKyc = async (payload: kycPayload) => {
    const response = await post<kycSubmissionResponse>(
        adminUrl.approveKyc(),
        payload
    );
    return response.data;
};

export const rejectKyc = async (payload: kycPayload) => {
    const response = await post<kycSubmissionResponse>(
        adminUrl.rejectKyc(),
        payload
    );
    return response.data;
};