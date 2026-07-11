export interface CreateInvestmentPayload {
  name: string;
  description: string;
  farmCategoryId: string;
  roiPercentage: number;
  durationValue: number;
  durationUnit: string;
  riskLevel: string;
  fundingMinGoal: number;
  fundingMaxGoal: number;
  investmentMinGoal: number;
  investmentMaxGoal: number;
  currency: string;
  milestones?: CreateInvestmentMilestonePayload[];
}

export interface CreateInvestmentMilestonePayload {
  name: string;
  fundReleasePercentage: number;
  order: number;
  isActive: boolean;
}

export interface InvestmentResponse {
  id: string;
  farmCategoryId: string;
  farmCategory?: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    milestoneCount: number;
    createdAt: string;
    updatedAt: string;
  };
  name: string;
  description: string;
  roiPercentage: number;
  durationValue: number;
  durationUnit: string;
  duration?: {
    value: number;
    unit: string;
    label: string;
  };
  riskLevel: string;
  fundingRules?: {
    minGoal: number;
    maxGoal: number;
    currency: string;
  };
  investmentLimit?: {
    minGoal: number;
    maxGoal: number;
    currency: string;
  };
  currency: string;
  isActive: boolean;
  milestones: InvestmentMilestoneResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentMilestoneResponse {
  id: string;
  investmentId: string;
  name: string;
  fundReleasePercentage: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListInvestmentsResponse {
  investments: InvestmentResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalInvestments?: number;
    totalItems?: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ListInvestmentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  farmCategoryId?: string;
  activeOnly?: boolean;
}

export interface AddInvestmentMilestonePayload {
  name: string;
  fundReleasePercentage: number;
  order: number;
  isActive: boolean;
}

export interface UpdateInvestmentMilestonePayload {
  name?: string;
  fundReleasePercentage?: number;
  order?: number;
  isActive?: boolean;
}
