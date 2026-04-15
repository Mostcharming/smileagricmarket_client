import {
	createMilestone,
	deleteAllMilestonesByCategory,
	deleteMilestone,
	getAdminMilestonesByCategory,
	getMilestones,
	updateMilestone,
} from "@/api";
import { MilestoneBulkPayload, MilestonePayload } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type CreateMilestonePayload = MilestonePayload | MilestoneBulkPayload;

export const useGetMilestones = () => {
	return useQuery({
		queryKey: ["milestones"],
		queryFn: () => getMilestones(),
	});
};

export const useGetAdminMilestonesByCategory = (categoryId?: string) => {
	return useQuery({
		queryKey: ["milestones", categoryId],
		queryFn: () => getAdminMilestonesByCategory(categoryId!),
		enabled: !!categoryId,
	});
};

export const useCreateMilestone = () => {
	return useMutation({
		mutationFn: ({
			categoryId,
			payload,
		}: {
			categoryId: string;
			payload: CreateMilestonePayload;
		}) => createMilestone(categoryId, payload),
	});
};

export const useUpdateMilestone = () => {
	return useMutation({
		mutationFn: ({
			milestoneId,
			payload,
		}: {
			milestoneId: string;
			payload: Partial<MilestonePayload>;
		}) => updateMilestone(milestoneId, payload),
	});
};

export const useDeleteMilestone = () => {
	return useMutation({
		mutationFn: (milestoneId: string) => deleteMilestone(milestoneId),
	});
};

export const useDeleteAllMilestonesByCategory = () => {
	return useMutation({
		mutationFn: (categoryId: string) =>
			deleteAllMilestonesByCategory(categoryId),
	});
};
