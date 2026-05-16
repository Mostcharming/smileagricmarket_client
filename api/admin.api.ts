import { adminUrl } from "@/constants";
import { buildQueryString, get, post } from "@/utils";
import {
    AdminKycDetailsResponse,
    AdminFarmApprovalPayload,
    AdminFarmApprovalResponse,
    AdminFarmDetailsResponse,
    AdminFarmRejectionPayload,
    AdminFarmRejectionResponse,
    ApiResponse,
    FarmsDirectory,
    kycPayload,
    kycSubmissionResponse,
    PaginatedFilter,
    UsersDirectory,
} from "@/types";

export const getUsers = async (
    filter: PaginatedFilter
): Promise<ApiResponse<UsersDirectory>> => {
    const query = buildQueryString(filter);
    const response = await get<UsersDirectory>(adminUrl.getUsers(query));
    return response;
};

export const getAdminFarms = async (
    filter: PaginatedFilter
): Promise<ApiResponse<FarmsDirectory>> => {
    const query = buildQueryString(filter);
    const response = await get<FarmsDirectory>(adminUrl.getUserFarms(query));
    return response;
};

export const getAdminFarmById = async (
    farmId: string
): Promise<AdminFarmDetailsResponse> => {
    const response = await get<AdminFarmDetailsResponse>(adminUrl.getUserFarmById(farmId));
    return response.data;
};

export const approveAdminFarm = async (
    payload: AdminFarmApprovalPayload
): Promise<AdminFarmApprovalResponse> => {
    const response = await post<AdminFarmApprovalResponse>(adminUrl.approveUserFarm(), payload);
    return response.data;
};

export const rejectAdminFarm = async (
    payload: AdminFarmRejectionPayload
): Promise<AdminFarmRejectionResponse> => {
    const response = await post<AdminFarmRejectionResponse>(adminUrl.rejectUserFarm(), payload);
    return response.data;
};

export const getUserDetails = async (userId: string) => {
    const response = await get<AdminKycDetailsResponse>(
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