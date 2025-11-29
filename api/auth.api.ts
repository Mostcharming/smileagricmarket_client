import { authUrl } from "@/constants";
import { post } from "@/utils";
import { ApiResponse, AuthPayload } from "@/types";

export async function requestOtp(
    payload: AuthPayload
): Promise<ApiResponse<string[]>> {
    const response = await post<string[]>(authUrl.requestOtp(), payload);
    return response;
}

export async function verifyOtp(
    payload: AuthPayload
): Promise<ApiResponse<string[]>> {
    const response = await post<string[]>(authUrl.verifyOtp(), payload);
    return response;
}

export async function completeUserProfile(
    payload: AuthPayload
): Promise<ApiResponse<string[]>> {
    const response = await post<string[]>(authUrl.completeUserProfile(), payload);
    return response;
}