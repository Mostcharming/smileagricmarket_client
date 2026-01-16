import { AxiosError } from "axios";
import { adminLogin, completeUserProfile, forgotPassword, loginPassword, requestOtp, resetPassword, setPassword, verifyOtp } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse, AuthPayload, TokenResponse } from "@/types";

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

export function useCompleteUserProfile() {
    return useMutation<
        ApiResponse<TokenResponse>,
        AxiosError<ApiResponse<{ token: string }>>,
        AuthPayload
    >({
        mutationFn: (payload: AuthPayload) => completeUserProfile(payload),
    });
}

export const useSetPassword = () => {
    return useMutation<
        ApiResponse<TokenResponse>,
        AxiosError<ApiResponse<{ token: string }>>,
        AuthPayload
    >({
        mutationFn: (payload: AuthPayload) => setPassword(payload),
    });
};

export const useLoginPassword = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => loginPassword(payload),
    });
};

export const useAdminLogin = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => adminLogin(payload),
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => forgotPassword(payload),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => resetPassword(payload),
    });
};