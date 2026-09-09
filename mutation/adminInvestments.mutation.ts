import {
  createInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
  addInvestmentMilestone,
  updateInvestmentMilestone,
  deleteInvestmentMilestone,
  getUserInvestments,
  getUserInvestmentMilestones,
  downloadUserInvestmentMilestones,
  getUserInvestmentMilestoneById,
  updateUserInvestmentMilestoneChecklist,
  reviewUserInvestmentMilestone,
} from "@/api";
import {
  CreateInvestmentPayload,
  ListInvestmentsQueryParams,
  AddInvestmentMilestonePayload,
  UpdateInvestmentMilestonePayload,
  ListUserInvestmentsQueryParams,
  ListUserInvestmentMilestonesQueryParams,
  UpdateMilestoneChecklistPayload,
  ReviewMilestonePayload,
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

// User Investments & Milestone Reviews Hooks
export const useGetUserInvestments = (filter: ListUserInvestmentsQueryParams = {}) => {
  return useQuery({
    queryKey: ["adminUserInvestments", filter],
    queryFn: () => getUserInvestments(filter),
  });
};

export const useGetUserInvestmentMilestones = (filter: ListUserInvestmentMilestonesQueryParams = {}) => {
  return useQuery({
    queryKey: ["adminUserInvestmentMilestones", filter],
    queryFn: () => getUserInvestmentMilestones(filter),
  });
};

export const useDownloadUserInvestmentMilestones = () => {
  return useMutation({
    mutationFn: (filter: ListUserInvestmentMilestonesQueryParams = {}) =>
      downloadUserInvestmentMilestones(filter),
  });
};

export const useGetUserInvestmentMilestoneById = (milestoneId?: string) => {
  return useQuery({
    queryKey: ["adminUserInvestmentMilestoneDetail", milestoneId],
    queryFn: () => getUserInvestmentMilestoneById(milestoneId!),
    enabled: !!milestoneId,
  });
};

export const useUpdateUserInvestmentMilestoneChecklist = () => {
  return useMutation({
    mutationFn: ({
      milestoneId,
      payload,
    }: {
      milestoneId: string;
      payload: UpdateMilestoneChecklistPayload;
    }) => updateUserInvestmentMilestoneChecklist(milestoneId, payload),
  });
};

export const useReviewUserInvestmentMilestone = () => {
  return useMutation({
    mutationFn: ({
      milestoneId,
      payload,
    }: {
      milestoneId: string;
      payload: ReviewMilestonePayload;
    }) => reviewUserInvestmentMilestone(milestoneId, payload),
  });
};
