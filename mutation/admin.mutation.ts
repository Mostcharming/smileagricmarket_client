import { useMutation, useQuery } from "@tanstack/react-query";
import {
    approveAdminFarm,
    approveKyc,
    getAdminFarmById,
    getAdminFarms,
    getUserDetails,
    getUsers,
    rejectAdminFarm,
    rejectKyc,
} from "@/api";
import { AdminFarmApprovalPayload, AdminFarmRejectionPayload, AdminKycDetailsResponse, kycPayload, PaginatedFilter } from "@/types";

export const useGetUsers = (filter: PaginatedFilter) => {
    return useQuery({
        queryKey: ["users", filter],
        queryFn: () => getUsers(filter),
        refetchOnMount: false,
    });
};

export const useGetAdminFarms = (filter: PaginatedFilter) => {
    return useQuery({
        queryKey: ["adminFarms", filter],
        queryFn: () => getAdminFarms(filter),
        refetchOnMount: false,
    });
};

export const useGetAdminFarmById = (farmId?: string) => {
    return useQuery({
        queryKey: ["adminFarm", farmId],
        queryFn: () => getAdminFarmById(farmId!),
        enabled: !!farmId,
    });
};

export const useGetUserDetails = (userId?: string) => {
    return useQuery({
        queryKey: ["userDetails", userId],
        queryFn: () => getUserDetails(userId!),
        enabled: !!userId,
    });
};

export const useApproveKyc = () => {
    return useMutation({
        mutationFn: ({
            payload
        }: {
            payload: kycPayload;
        }) => approveKyc(payload),
    });
};

export const useRejectKyc = () => {
    return useMutation({
        mutationFn: ({
            payload
        }: {
            payload: kycPayload;
        }) => rejectKyc(payload),
    });
};

export const useApproveAdminFarm = () => {
    return useMutation({
        mutationFn: ({
            payload,
        }: {
            payload: AdminFarmApprovalPayload;
        }) => approveAdminFarm(payload),
    });
};

export const useRejectAdminFarm = () => {
    return useMutation({
        mutationFn: ({
            payload,
        }: {
            payload: AdminFarmRejectionPayload;
        }) => rejectAdminFarm(payload),
    });
};