import { webInvestments } from "@/constants";
import { buildQueryString, get, post } from "@/utils";
import {
  ApiResponse,
  ListWebInvestmentsResponse,
  ListWebInvestmentsQueryParams,
  WebInvestmentDetails,
  InvestPayload,
  InvestResponse
} from "@/types";

export const getWebInvestments = async (
  filter: ListWebInvestmentsQueryParams
): Promise<ApiResponse<ListWebInvestmentsResponse>> => {
  const query = buildQueryString(filter);
  const response = await get<ListWebInvestmentsResponse>(
    webInvestments.getInvestments(query)
  );
  return response;
};

export const getWebInvestmentById = async (
  farmId: string
): Promise<ApiResponse<WebInvestmentDetails>> => {
  const response = await get<WebInvestmentDetails>(
    webInvestments.getInvestmentById(farmId)
  );
  return response;
};

export const investInFarm = async (
  farmId: string,
  payload: InvestPayload
): Promise<ApiResponse<InvestResponse>> => {
  const response = await post<InvestResponse>(
    webInvestments.invest(farmId),
    payload
  );
  return response;
};
