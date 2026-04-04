import {
	addMilestonesToFarm,
	createFarm,
	deleteFarm,
	deleteFarmDoc,
	deleteFarmMilestone,
	getFarmById,
	getFarms,
	updateFarm,
	uploadDocToFarm,
} from "@/api";
import {
	AddFarmMilestonesPayload,
	FarmPayload,
	PaginatedFilter,
	UploadFarmDocumentsPayload,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetFarms = (filter: PaginatedFilter) => {
	return useQuery({
		queryKey: ["farms", filter],
		queryFn: () => getFarms(filter),
	});
};

export const useGetFarmById = (farmId?: string) => {
	return useQuery({
		queryKey: ["farm", farmId],
		queryFn: () => getFarmById(farmId!),
		enabled: !!farmId,
	});
};

export const useCreateFarm = () => {
	return useMutation({
		mutationFn: (payload: FarmPayload) => createFarm(payload),
	});
};

export const useUpdateFarm = () => {
	return useMutation({
		mutationFn: ({
			farmId,
			payload,
		}: {
			farmId: string;
			payload: Partial<FarmPayload>;
		}) => updateFarm(farmId, payload),
	});
};

export const useDeleteFarm = () => {
	return useMutation({
		mutationFn: (farmId: string) => deleteFarm(farmId),
	});
};

export const useAddMilestonesToFarm = () => {
	return useMutation({
		mutationFn: ({
			farmId,
			payload,
		}: {
			farmId: string;
			payload: AddFarmMilestonesPayload;
		}) => addMilestonesToFarm(farmId, payload),
	});
};

export const useDeleteFarmMilestone = () => {
	return useMutation({
		mutationFn: ({
			farmId,
			milestoneId,
		}: {
			farmId: string;
			milestoneId: string;
		}) => deleteFarmMilestone(farmId, milestoneId),
	});
};

export const useUploadDocToFarm = () => {
	return useMutation({
		mutationFn: ({
			farmId,
			payload,
		}: {
			farmId: string;
			payload: UploadFarmDocumentsPayload;
		}) => uploadDocToFarm(farmId, payload),
	});
};

export const useDeleteFarmDoc = () => {
	return useMutation({
		mutationFn: (docId: string) => deleteFarmDoc(docId),
	});
};
