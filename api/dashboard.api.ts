import { webDashboard, webFarmCategories } from "@/constants";
import { get } from "@/utils";
import {
	ApiResponse,
	DashboardResponse,
	DashboardStatsResponse,
	FarmCategoriesDirectory,
	MilestonesByCategoryDirectory,
} from "@/types";

export const getFarmCategories = async (): Promise<
	ApiResponse<FarmCategoriesDirectory>
> => {
	const response = await get<FarmCategoriesDirectory>(
		webFarmCategories.getCategories()
	);
	return response;
};

export const getMilestonesByCategory = async (
	categoryId: string
): Promise<ApiResponse<MilestonesByCategoryDirectory>> => {
	const response = await get<MilestonesByCategoryDirectory>(
		webFarmCategories.getMilestoneByCategory(categoryId)
	);
	return response;
};

export const getDashboard = async (): Promise<ApiResponse<DashboardResponse>> => {
	const response = await get<DashboardResponse>(webDashboard.getDashboard());
	return response;
};

export const getDashboardStats = async (): Promise<
	ApiResponse<DashboardStatsResponse>
> => {
	const response = await get<DashboardStatsResponse>(webDashboard.getStats());
	return response;
};