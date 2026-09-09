import { adminInvestments } from "@/constants";
import { buildQueryString, get, post, put, remove } from "@/utils";
import axiosInstance from "@/utils/axios";
import {
  ApiResponse,
  CreateInvestmentPayload,
  InvestmentResponse,
  ListInvestmentsResponse,
  AddInvestmentMilestonePayload,
  UpdateInvestmentMilestonePayload,
  InvestmentMilestoneResponse,
  DeleteResourceResponse,
  ListInvestmentsQueryParams,
  ListUserInvestmentsQueryParams,
  ListUserInvestmentsResponse,
  ListUserInvestmentMilestonesQueryParams,
  ListUserInvestmentMilestonesResponse,
  UserInvestmentMilestoneDetail,
  UpdateMilestoneChecklistPayload,
  ReviewMilestonePayload,
} from "@/types";

export const createInvestment = async (
  payload: CreateInvestmentPayload
): Promise<ApiResponse<InvestmentResponse>> => {
  const response = await post<InvestmentResponse>(
    adminInvestments.createInvestment(),
    payload
  );
  return response;
};

export const getInvestments = async (
  filter: ListInvestmentsQueryParams
): Promise<ApiResponse<ListInvestmentsResponse>> => {
  const query = buildQueryString(filter);
  const response = await get<ListInvestmentsResponse>(
    adminInvestments.getInvestments(query)
  );
  return response;
};

export const getInvestmentById = async (
  investmentId: string
): Promise<ApiResponse<InvestmentResponse>> => {
  const response = await get<InvestmentResponse>(
    adminInvestments.getInvestmentById(investmentId)
  );
  return response;
};

export const updateInvestment = async (
  investmentId: string,
  payload: Partial<CreateInvestmentPayload>
): Promise<ApiResponse<InvestmentResponse>> => {
  const response = await put<InvestmentResponse>(
    adminInvestments.updateInvestment(investmentId),
    payload
  );
  return response;
};

export const deleteInvestment = async (
  investmentId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
  const response = await remove<DeleteResourceResponse>(
    adminInvestments.deleteInvestment(investmentId)
  );
  return response;
};

export const addInvestmentMilestone = async (
  investmentId: string,
  payload: AddInvestmentMilestonePayload
): Promise<ApiResponse<InvestmentMilestoneResponse>> => {
  const response = await post<InvestmentMilestoneResponse>(
    adminInvestments.addMilestone(investmentId),
    payload
  );
  return response;
};

export const updateInvestmentMilestone = async (
  milestoneId: string,
  payload: UpdateInvestmentMilestonePayload
): Promise<ApiResponse<InvestmentMilestoneResponse>> => {
  const response = await put<InvestmentMilestoneResponse>(
    adminInvestments.updateMilestone(milestoneId),
    payload
  );
  return response;
};

export const deleteInvestmentMilestone = async (
  milestoneId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
  const response = await remove<DeleteResourceResponse>(
    adminInvestments.deleteMilestone(milestoneId)
  );
  return response;
};

export const getUserInvestments = async (
  filter: ListUserInvestmentsQueryParams = {}
): Promise<ApiResponse<ListUserInvestmentsResponse>> => {
  const query = buildQueryString(filter);
  const response = await get<ListUserInvestmentsResponse>(
    adminInvestments.getUserInvestments(query)
  );
  return response;
};

export const getUserInvestmentMilestones = async (
  filter: ListUserInvestmentMilestonesQueryParams = {}
): Promise<ApiResponse<ListUserInvestmentMilestonesResponse>> => {
  const query = buildQueryString(filter);
  const response = await get<ListUserInvestmentMilestonesResponse>(
    adminInvestments.getUserInvestmentMilestones(query)
  );
  return response;
};

export const downloadUserInvestmentMilestones = async (
  filter: ListUserInvestmentMilestonesQueryParams = {}
): Promise<Blob> => {
  const query = buildQueryString(filter);
  const response = await axiosInstance.get(
    adminInvestments.downloadUserInvestmentMilestones(query),
    {
      responseType: "blob",
    }
  );
  return response.data;
};

export const getUserInvestmentMilestoneById = async (
  milestoneId: string
): Promise<ApiResponse<UserInvestmentMilestoneDetail>> => {
  const response = await get<UserInvestmentMilestoneDetail>(
    adminInvestments.getUserInvestmentMilestoneById(milestoneId)
  );
  return response;
};

export const updateUserInvestmentMilestoneChecklist = async (
  milestoneId: string,
  payload: UpdateMilestoneChecklistPayload
): Promise<ApiResponse<UserInvestmentMilestoneDetail>> => {
  const response = await put<UserInvestmentMilestoneDetail>(
    adminInvestments.updateUserInvestmentMilestoneChecklist(milestoneId),
    payload
  );
  return response;
};

export const reviewUserInvestmentMilestone = async (
  milestoneId: string,
  payload: ReviewMilestonePayload
): Promise<ApiResponse<UserInvestmentMilestoneDetail>> => {
  const response = await post<UserInvestmentMilestoneDetail>(
    adminInvestments.reviewUserInvestmentMilestone(milestoneId),
    payload
  );
  return response;
};
