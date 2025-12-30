import { getKycStatus, submitKyc, updateKyc } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { KycPayload } from "@/types";

export const useSubmitKyc = () => {
    return useMutation({
        mutationFn: (payload: FormData) => submitKyc(payload),
    });
};

export const useGetKycStatus = () => {
    return useQuery({
        queryKey: ["kycStatus"],
        queryFn: () => getKycStatus(),
    });
};

export const useUpdateKyc = () => {
    return useMutation({
        mutationFn: (payload: KycPayload) => updateKyc(payload),
    });
};