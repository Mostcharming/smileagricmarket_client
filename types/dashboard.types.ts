export interface FarmCategoryResponse {
    id: string;
    name: string;
    description?: string;
    isActive?: boolean;
    milestoneCount?: number;
    milestones?: MilestoneResponse[];
    createdAt?: string;
    updatedAt?: string;
}

export interface FarmCategoriesDirectory {
    categories: FarmCategoryResponse[];
}

export interface MilestoneResponse {
    id: string;
    farmCategoryId?: string;
    farmCategoryName?: string;
    name: string;
    categoryId?: string;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface MilestonesByCategoryDirectory {
    category: FarmCategoryResponse;
    milestones: MilestoneResponse[];
}

export interface DashboardStatItem {
	label?: string;
	value?: number;
	amount?: number;
}

export interface DashboardSummaryResponse {
    totalFarmsListed: number;
    completedFarmProjects: number;
    totalExpectedInvestment: number;
    totalInvestmentReceived: number;
    investmentPending: number;
}

export interface DashboardFarmResponse {
    id: string;
    name: string;
    description?: string;
    location?: string;
    size?: number;
    Category?: Record<string, unknown>;
    Investment?: Record<string, unknown>;
}

export interface DashboardResponse {
    summary: DashboardSummaryResponse;
    farms: DashboardFarmResponse[];
}

export interface DashboardStatsResponse {
    farmsCount: number;
}
