import { adminMilestones } from "@/constants";
import { get, post, put, remove } from "@/utils";
import {
	ApiResponse,
	DeleteResourceResponse,
	MilestoneBulkPayload,
	MilestonePayload,
	MilestoneResponse,
} from "@/types";

type CreateMilestonePayload = MilestonePayload | MilestoneBulkPayload;

export const createMilestone = async (
	categoryId: string,
	payload: CreateMilestonePayload
): Promise<ApiResponse<MilestoneResponse | MilestoneResponse[]>> => {
	const response = await post<MilestoneResponse | MilestoneResponse[]>(
		adminMilestones.createMilestone(categoryId),
		payload
	);
	return response;
};

export const getAdminMilestonesByCategory = async (
	categoryId: string
): Promise<ApiResponse<MilestoneResponse[]>> => {
	const response = await get<MilestoneResponse[]>(
		adminMilestones.getMilestonesByCategory(categoryId)
	);
	return response;
};

export const getMilestones = async (): Promise<
	ApiResponse<MilestoneResponse[]>
> => {
	const response = await get<MilestoneResponse[]>(
		adminMilestones.getMilestones()
	);
	return response;
};

export const updateMilestone = async (
	milestoneId: string,
	payload: Partial<MilestonePayload>
): Promise<ApiResponse<MilestoneResponse>> => {
	const response = await put<MilestoneResponse>(
		adminMilestones.updateMilestone(milestoneId),
		payload
	);
	return response;
};

export const deleteMilestone = async (
	milestoneId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(
		adminMilestones.deleteMilestone(milestoneId)
	);
	return response;
};

export const deleteAllMilestonesByCategory = async (
	categoryId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(
		adminMilestones.deleteAllMilestonesByCategory(categoryId)
	);
	return response;
};
