import {
	getDashboard,
	getDashboardStats,
	getFarmCategories,
	getMilestonesByCategory,
} from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetFarmCategories = () => {
	return useQuery({
		queryKey: ["webFarmCategories"],
		queryFn: () => getFarmCategories(),
	});
};

export const useGetMilestonesByCategory = (categoryId?: string) => {
	return useQuery({
		queryKey: ["webMilestones", categoryId],
		queryFn: () => getMilestonesByCategory(categoryId!),
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
