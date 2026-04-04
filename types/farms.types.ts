import { Pagination } from "./apiResponse.types";

export interface FarmPayload {
	name: string;
	size?: number;
	description?: string;
	farmCategoryId: string;
	location?: string;
	isActive?: boolean;
	selectedMilestones?: string[];
	pictures?: string[];
	documents?: string[];
}

export interface FarmMilestonePayload {
	milestoneId: string;
}

export interface AddFarmMilestonesPayload {
	milestones: string[];
}

export interface UploadFarmDocumentsPayload {
	pictures: (File | string)[];
	documents: (File | string)[];
}

export interface FarmMilestoneResponse {
	id: string;
	milestoneId?: string;
	name?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface FarmDocumentResponse {
	id: string;
	farmId?: string;
	url?: string;
	name?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Category {
	id?: string;
	name?: string;
}

export interface Investment {
	id?: string;
	amount?: number;
	status?: string;
}

export interface Statistics {
	totalMilestones?: number;
	completedMilestones?: number;
	completionPercentage?: number;
}

export interface FarmResponse {
	id: string;
	name: string;
	description?: string;
	location?: string;
	size?: number;
	Category?: Category;
	Investment?: Investment;
	stats?: Statistics;
	createdAt: string;
}

export interface FarmsDirectory {
	farms: FarmResponse[];
	pagination: Pagination;
}