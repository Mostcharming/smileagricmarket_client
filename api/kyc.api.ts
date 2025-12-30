import { kycUrl } from "@/constants";
import { get, post, put } from "@/utils";
import { ApiResponse, KycPayload, KycResponse } from "@/types";

export const submitKyc = async (payload: FormData) => {
  const response = await post<KycResponse>(
    kycUrl.submitKyc(),
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const getKycStatus = async (): Promise<
  ApiResponse<KycResponse>
> => {
  const response = await get<KycResponse>(
    kycUrl.getKycStatus()
  );
  return response;
};

export const updateKyc = async (
  payload: KycPayload
): Promise<ApiResponse<KycResponse>> => {
  const response = await put<KycPayload>(
    kycUrl.updateKyc(),
    payload
  );
  return response;
};