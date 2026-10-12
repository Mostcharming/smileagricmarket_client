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

export interface CreateInvestmentProjectPayload {
	farmCategoryId: string;
	fundingGoalAmount: number;
}

export interface UploadFarmDocumentsPayload {
	pictures: (File | string)[];
	documents: (File | string)[];
}

export interface RequestMilestoneFundingPayload {
	selectedMilestoneId: string;
	investmentProjectId?: string;
	photos?: (File | string)[];
	files?: (File | string)[];
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

export interface FundingEvidenceItem {
	id: string;
	evidenceType?: string;
	fileName?: string;
	fileUrl?: string;
	fileSize?: number;
	mimeType?: string;
	createdAt?: string;
}

export interface ProjectMilestoneItem {
	id: string;
	userFarmInvestmentId?: string;
	investmentMilestoneId?: string;
	name: string;
	fundReleasePercentage?: string | number;
	order?: number;
	fundingStatus?: string;
	isCompleted?: boolean;
	completedAt?: string | null;
	amount?: string | number;
	InvestmentMilestone?: {
		id?: string;
		name?: string;
		order?: number;
		fundReleasePercentage?: string | number;
		investmentId?: string;
	};
	Milestone?: {
		id?: string;
		name?: string;
		order?: number;
		amount?: number | string;
	} | null;
	FundingEvidence?: FundingEvidenceItem[];
}

export interface InvestmentTemplateItem {
	id?: string;
	name?: string;
	roiPercentage?: string | number;
	fundingMinGoal?: string | number;
	fundingMaxGoal?: string | number;
	currency?: string;
}

export interface InvestmentProjectItem {
	id?: string;
	farmCategoryId?: string;
	investmentId?: string;
	expectedInvestment?: string | number;
	investmentReceived?: string | number;
	investmentPending?: string | number;
	investmentStatus?: string;
	startDate?: string;
	endDate?: string;
	currency?: string;
	notes?: string | null;
	Category?: Category;
	category?: Category;
	farmCategory?: Category;
	InvestmentTemplate?: InvestmentTemplateItem;
	investmentTemplate?: InvestmentTemplateItem;
	ProjectMilestones?: ProjectMilestoneItem[];
	projectMilestones?: ProjectMilestoneItem[];
	milestones?: ProjectMilestoneItem[];
}

export interface FarmResponse {
	id: string;
	name: string;
	description?: string;
	location?: string;
	size?: number;
	isActive?: boolean;
	Category?: Category;
	category?: Category;
	farmCategory?: Category;
	InvestmentProjects?: InvestmentProjectItem[];
	investmentProjects?: InvestmentProjectItem[];
	InvestmentProject?: InvestmentProjectItem;
	investmentProject?: InvestmentProjectItem;
	Investment?: Investment & {
		investmentReceived?: string;
		expectedInvestment?: string;
	};
	stats?: Statistics;
	createdAt: string;

	// Backend API returned fields to remove frontend type casts
	verificationStatus?: string;
	rejectionNote?: string | null;
	verificationNote?: string;
	investmentAmount?: number;
	pictures?: Array<{ id: string; url: string; name?: string }>;
	documents?: Array<{ id: string; name?: string; url?: string; size?: number | string; status?: string; fileUrl?: string; fileName?: string; fileSize?: number; documentType?: string; mimeType?: string; createdAt?: string }>;
	Documents?: Array<{ id: string; name?: string; url?: string; size?: number | string; status?: string; fileUrl?: string; fileName?: string; fileSize?: number; documentType?: string; mimeType?: string; createdAt?: string }>;
	photos?: Array<{ id: string; documentType?: string; fileName?: string; fileUrl?: string; fileSize?: number; mimeType?: string; createdAt?: string }>;
	farmDocuments?: Array<{ id: string; documentType?: string; fileName?: string; fileUrl?: string; fileSize?: number; mimeType?: string; createdAt?: string }>;
	milestones?: ProjectMilestoneItem[];
	SelectedMilestones?: ProjectMilestoneItem[];
	ProjectMilestones?: ProjectMilestoneItem[];
	userId?: string;
	user?: {
		id?: string;
		verifiedFarmsCount?: number;
		totalFundsReceived?: string | number;
		fullName?: string;
		email?: string;
		phoneNumber?: string;
		profileImage?: string;
		createdAt?: string;
	};
	User?: {
		id?: string;
		verifiedFarmsCount?: number;
		totalFundsReceived?: string | number;
		fullName?: string;
		email?: string;
		phoneNumber?: string;
		profileImage?: string;
		createdAt?: string;
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