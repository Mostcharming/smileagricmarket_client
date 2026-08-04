import { marketingAdminUrl, webMarketingUrl } from "@/constants";
import { buildQueryString, get, post } from "@/utils";
import axiosInstance from "@/utils/axios";
import { ApiResponse, AuthPayload, BetaSignupsFilter, BetaSignupsResponse, MarketingLoginResponse, BetaSignupPayload, BetaSignup } from "@/types";

export const marketingLogin = async (
    payload: AuthPayload
): Promise<ApiResponse<MarketingLoginResponse>> => {
    const response = await post<MarketingLoginResponse>(marketingAdminUrl.login(), payload);
    return response;
};

export const getBetaSignups = async (
    filter: BetaSignupsFilter
): Promise<ApiResponse<BetaSignupsResponse>> => {
    const query = buildQueryString(filter);
    const response = await get<BetaSignupsResponse>(marketingAdminUrl.getBetaSignups(query));
    return response;
};

export const downloadBetaSignups = async (query?: string): Promise<Blob> => {
    const queryString = query ? `?query=${encodeURIComponent(query)}` : "";
    const response = await axiosInstance.get(marketingAdminUrl.downloadBetaSignups(queryString), {
        responseType: 'blob',
    });
    return response.data;
};

export const createBetaSignup = async (
    payload: BetaSignupPayload
): Promise<ApiResponse<BetaSignup>> => {
    const response = await post<BetaSignup>(webMarketingUrl.betaSignup(), payload);
    return response;
};
