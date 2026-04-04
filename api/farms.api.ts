import { webFarms } from "@/constants";
import { buildQueryString, get, post, put, remove } from "@/utils";
import {
	AddFarmMilestonesPayload,
	ApiResponse,
	DeleteResourceResponse,
	FarmPayload,
	FarmResponse,
	FarmsDirectory,
	PaginatedFilter,
	UploadFarmDocumentsPayload,
} from "@/types";

export const getFarms = async (
	filter: PaginatedFilter
): Promise<ApiResponse<FarmsDirectory>> => {
	const query = buildQueryString(filter);
	const response = await get<FarmsDirectory>(webFarms.getFarms(query));
	return response;
};

export const createFarm = async (
	payload: FarmPayload
): Promise<ApiResponse<FarmResponse>> => {
	const response = await post<FarmResponse>(webFarms.createFarm(), payload);
	return response;
};

export const getFarmById = async (
	farmId: string
): Promise<ApiResponse<FarmResponse>> => {
	const response = await get<FarmResponse>(webFarms.getFarmById(farmId));
	return response;
};

export const updateFarm = async (
	farmId: string,
	payload: Partial<FarmPayload>
): Promise<ApiResponse<FarmResponse>> => {
	const response = await put<FarmResponse>(webFarms.updateFarm(farmId), payload);
	return response;
};

export const deleteFarm = async (
	farmId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(webFarms.deleteFarm(farmId));
	return response;
};

export const addMilestonesToFarm = async (
	farmId: string,
	payload: AddFarmMilestonesPayload
): Promise<ApiResponse<FarmResponse>> => {
	const response = await post<FarmResponse>(
		webFarms.addMilestonesToFarm(farmId),
		payload
	);
	return response;
};

export const deleteFarmMilestone = async (
	farmId: string,
	milestoneId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(
		webFarms.deleteFarmMilestone(farmId, milestoneId)
	);
	return response;
};

export const uploadDocToFarm = async (
	farmId: string,
	payload: UploadFarmDocumentsPayload
): Promise<ApiResponse<FarmResponse>> => {
	const formData = new FormData();

	payload.pictures.forEach((picture) => {
		formData.append("pictures", picture);
	});

	payload.documents.forEach((document) => {
		formData.append("documents", document);
	});

	const response = await post<FarmResponse>(webFarms.uploadDocToFarm(farmId), formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response;
};

export const deleteFarmDoc = async (
	documentId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(webFarms.deleteFarmDoc(documentId));
	return response;
};
