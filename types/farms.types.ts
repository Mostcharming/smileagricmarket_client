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

export interface FarmMilestoneSelectionPayload {
	milestoneId: string;
	amount: number;
}

export interface AddFarmMilestonesPayload {
	milestones: FarmMilestoneSelectionPayload[];
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
	Investment?: Investment & {
		investmentReceived?: string;
		expectedInvestment?: string;
	};
	stats?: Statistics;
	createdAt: string;

	// Backend API returned fields to remove frontend type casts
	verificationStatus?: string;
	verificationNote?: string;
	investmentAmount?: number;
	pictures?: Array<{ id: string; url: string; name?: string }>;
	documents?: Array<{ id: string; name: string; url: string; size?: number | string; status?: string; fileUrl?: string; fileName?: string; fileSize?: number }>;
	Documents?: Array<{ id: string; name: string; url: string; size?: number | string; status?: string; fileUrl?: string; fileName?: string; fileSize?: number }>;
	milestones?: Array<{
		id: string;
		amount?: number | string;
		Milestone?: {
			id: string;
			name: string;
			amount?: number | string;
			order?: number;
		};
		name?: string;
		order?: number;
	}>;
	SelectedMilestones?: Array<{
		id: string;
		amount?: number | string;
		Milestone?: {
			id: string;
			name: string;
			amount?: number | string;
			order?: number;
		};
		name?: string;
		order?: number;
	}>;
	user?: {
		verifiedFarmsCount?: number;
		totalFundsReceived?: string | number;
		fullName?: string;
		email?: string;
		profileImage?: string;
	};
	User?: {
		verifiedFarmsCount?: number;
		totalFundsReceived?: string | number;
		fullName?: string;
		email?: string;
		profileImage?: string;
	};
	investorName?: string;
}

export interface FarmsDirectory {
	farms: FarmResponse[];
	pagination: Pagination;
}

export interface AdminFarmDetailsResponse extends FarmResponse {}

export interface AdminFarmApprovalPayload {
	farmId: string;
}

export interface AdminFarmApprovalResponse {
	farmId: string;
	status: string;
}

export interface AdminFarmRejectionPayload {
	farmId: string;
	note: string;
}

export interface AdminFarmRejectionResponse {
	farmId: string;
	status: string;
	rejectionNote: string;
}