import {
	getDashboard,
	getDashboardStats,
	getFarmCategories,
	getWebMilestonesByCategory,
} from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetFarmCategories = () => {
	return useQuery({
		queryKey: ["webFarmCategories"],
		queryFn: () => getFarmCategories(),
	});
};

export const useGetWebMilestonesByCategory = (categoryId?: string) => {
	return useQuery({
		queryKey: ["webMilestones", categoryId],
		queryFn: () => getWebMilestonesByCategory(categoryId!),
		enabled: !!categoryId,
	});
};

export const useGetDashboard = () => {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard(),
	});
};

export const useGetDashboardStats = () => {
	return useQuery({
		queryKey: ["dashboardStats"],
		queryFn: () => getDashboardStats(),
	});
};
