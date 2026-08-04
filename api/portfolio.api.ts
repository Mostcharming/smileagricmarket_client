import { webPortfolio } from "@/constants";
import { buildQueryString, get } from "@/utils";
import {
  ApiResponse,
  GetPortfolioResponse,
  GetPortfolioFarmsResponse,
  PortfolioFarmsQueryParams,
  GetPortfolioFarmByIdResponse
} from "@/types";

export const getPortfolio = async (): Promise<ApiResponse<GetPortfolioResponse>> => {
  const response = await get<GetPortfolioResponse>(webPortfolio.getPortfolio());
  return response;
};

export const getPortfolioFarms = async (
  filter: PortfolioFarmsQueryParams = {}
): Promise<ApiResponse<GetPortfolioFarmsResponse>> => {
  const query = buildQueryString(filter);
  const response = await get<GetPortfolioFarmsResponse>(
    webPortfolio.getPortfolioFarms(query)
  );
  return response;
};

export const getPortfolioFarmById = async (
  farmId: string
): Promise<ApiResponse<GetPortfolioFarmByIdResponse>> => {
  const response = await get<GetPortfolioFarmByIdResponse>(
    webPortfolio.getPortfolioFarmById(farmId)
  );
  return response;
};
