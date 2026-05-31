import { webProfile } from "@/constants";
import { get, post, put } from "@/utils";
import {
  ApiResponse,
  BankDirectoryEntry,
  WebProfileCompletionStatusResponse,
  WebProfilePayload,
  WebProfileResponse,
  WebProfileWalletPayload,
  WebProfileWalletResponse,
} from "@/types";

export const getWebProfile = async (): Promise<ApiResponse<WebProfileResponse>> => {
  const response = await get<WebProfileResponse>(webProfile.getProfile());
  return response;
};

export const updateWebProfile = async (
  payload: WebProfilePayload
): Promise<ApiResponse<WebProfileResponse>> => {
  const response = await put<WebProfileResponse>(webProfile.updateProfile(), payload);
  return response;
};

export const uploadWebProfilePicture = async (
  payload: FormData
): Promise<ApiResponse<{ id: string; profileImageUrl: string }>> => {
  const response = await post<{ id: string; profileImageUrl: string }>(
    webProfile.uploadProfilePicture(),
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const getWebProfileCompletionStatus = async (): Promise<
  ApiResponse<WebProfileCompletionStatusResponse>
> => {
  const response = await get<WebProfileCompletionStatusResponse>(
    webProfile.getProfileCompletionStatus()
  );
  return response;
};

export const setupWebProfileWallet = async (
  payload: WebProfileWalletPayload
): Promise<ApiResponse<WebProfileWalletResponse>> => {
  const response = await post<WebProfileWalletResponse>(
    webProfile.setupWallet(),
    payload
  );
  return response;
};

export const getWebProfileWallet = async (): Promise<
  ApiResponse<WebProfileWalletResponse>
> => {
  const response = await get<WebProfileWalletResponse>(webProfile.getWallet());
  return response;
};

export const getWebBanks = async (): Promise<ApiResponse<BankDirectoryEntry[]>> => {
  const response = await fetch("/api/banks", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load bank directory");
  }

  const payload = (await response.json()) as {
    success?: boolean;
    message?: string;
    data: BankDirectoryEntry[];
  };

  return {
    success: payload.success ?? true,
    status: response.status,
    message: payload.message ?? "Bank directory retrieved successfully",
    data: payload.data,
  };
};