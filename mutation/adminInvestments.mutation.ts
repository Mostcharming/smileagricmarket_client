import {
  createInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
  addInvestmentMilestone,
  updateInvestmentMilestone,
  deleteInvestmentMilestone
} from "@/api";
import {
  CreateInvestmentPayload,
  ListInvestmentsQueryParams,
  AddInvestmentMilestonePayload,
  UpdateInvestmentMilestonePayload
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetInvestments = (filter: ListInvestmentsQueryParams = {}) => {
  return useQuery({
    queryKey: ["adminInvestments", filter],
    queryFn: () => getInvestments(filter),
  });
};

export const useGetInvestmentById = (investmentId?: string) => {
  return useQuery({
    queryKey: ["adminInvestments", investmentId],
    queryFn: () => getInvestmentById(investmentId!),
    enabled: !!investmentId,
  });
};

export const useCreateInvestment = () => {
  return useMutation({
    mutationFn: (payload: CreateInvestmentPayload) => createInvestment(payload),
  });
};

export const useUpdateInvestment = () => {
  return useMutation({
    mutationFn: ({
      investmentId,
      payload,
    }: {
      investmentId: string;
      payload: Partial<CreateInvestmentPayload>;
    }) => updateInvestment(investmentId, payload),
  });
};

export const useDeleteInvestment = () => {
  return useMutation({
    mutationFn: (investmentId: string) => deleteInvestment(investmentId),
  });
};

export const useAddInvestmentMilestone = () => {
  return useMutation({
    mutationFn: ({
      investmentId,
      payload,
    }: {
      investmentId: string;
      payload: AddInvestmentMilestonePayload;
    }) => addInvestmentMilestone(investmentId, payload),
  });
};

export const useUpdateInvestmentMilestone = () => {
  return useMutation({
    mutationFn: ({
      milestoneId,
      payload,
    }: {
      milestoneId: string;
      payload: UpdateInvestmentMilestonePayload;
    }) => updateInvestmentMilestone(milestoneId, payload),
  });
};

export const useDeleteInvestmentMilestone = () => {
  return useMutation({
    mutationFn: (milestoneId: string) => deleteInvestmentMilestone(milestoneId),
  });
};
