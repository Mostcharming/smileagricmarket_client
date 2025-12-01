import { authUrl } from "@/constants";
import { post } from "@/utils";
import { ApiResponse, AuthPayload, AuthResponse, ProfileResponse } from "@/types";

export async function requestOtp(
    payload: AuthPayload
): Promise<ApiResponse<string[]>> {
    const response = await post<string[]>(authUrl.requestOtp(), payload);
    return response;
}

export async function verifyOtp(
    payload: AuthPayload
): Promise<ApiResponse<AuthResponse>> {
    const response = await post<AuthResponse>(authUrl.verifyOtp(), payload);
    return response;
}

export async function completeUserProfile(
    payload: AuthPayload
): Promise<ApiResponse<ProfileResponse>> {
    const response = await post<ProfileResponse>(authUrl.completeUserProfile(), payload);
    return response;
}