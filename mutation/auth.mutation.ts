import { completeUserProfile, requestOtp, verifyOtp } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AuthPayload } from "@/types";

export const useRequestOtp = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => requestOtp(payload),
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => verifyOtp(payload),
    });
};

export const useCompleteUserProfile = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => completeUserProfile(payload),
    });
};