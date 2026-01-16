import { useMutation, useQuery } from "@tanstack/react-query";
import { approveKyc, getUserDetails, getUsers, rejectKyc } from "@/api";
import { kycPayload, PaginatedFilter } from "@/types";

export const useGetUsers = (filter: PaginatedFilter) => {
    return useQuery({
        queryKey: ["users", filter],
        queryFn: () => getUsers(filter),
        refetchOnMount: false,
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