import {
  getPortfolio,
  getPortfolioFarms,
  getPortfolioFarmById
} from "@/api/portfolio.api";
import { PortfolioFarmsQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetPortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: () => getPortfolio(),
  });
};

export const useGetPortfolioFarms = (filter: PortfolioFarmsQueryParams = {}) => {
  return useQuery({
    queryKey: ["portfolioFarms", filter],
    queryFn: () => getPortfolioFarms(filter),
  });
};

export const useGetPortfolioFarmById = (farmId?: string) => {
  return useQuery({
    queryKey: ["portfolioFarmDetails", farmId],
    queryFn: () => getPortfolioFarmById(farmId!),
    enabled: !!farmId,
  });
};
