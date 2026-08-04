import {
  getWebInvestments,
  getWebInvestmentById,
  investInFarm
} from "@/api/investments.api";
import {
  ListWebInvestmentsQueryParams,
  InvestPayload
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetWebInvestments = (filter: ListWebInvestmentsQueryParams = {}) => {
  return useQuery({
    queryKey: ["webInvestments", filter],
    queryFn: () => getWebInvestments(filter),
  });
};

export const useGetWebInvestmentById = (farmId?: string) => {
  return useQuery({
    queryKey: ["webInvestmentDetails", farmId],
    queryFn: () => getWebInvestmentById(farmId!),
    enabled: !!farmId,
  });
};

export const useInvest = () => {
  return useMutation({
    mutationFn: ({
      farmId,
      payload,
    }: {
      farmId: string;
      payload: InvestPayload;
    }) => investInFarm(farmId, payload),
  });
};
