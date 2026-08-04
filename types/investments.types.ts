export interface CreateInvestmentPayload {
  name: string;
  description: string;
  farmCategoryId: string;
  startDate: string;
  endDate: string;
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
  startDate?: string;
  endDate?: string;
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

export interface WebInvestmentItem {
  id: string;
  farmId: string;
  farmName: string;
  image: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  } | null;
  imageUrl: string | null;
  farmCategory: {
    id: string;
    name: string;
  };
  investmentTemplate: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  roi: number;
  roiPercentage: number;
  startDate: string;
  endDate: string;
  duration: {
    value: number;
    unit: string;
    label: string;
  };
  riskLevel: string;
  farmOwner: {
    id: string;
    name: string;
  };
  farmOwnerName: string;
  rating: number | null;
  fundingReceived: number;
  totalExpectedFunding: number;
  location: string;
  percentFunded: number;
  minimumInvest: number;
  fundingStatus: string;
  currency: string;
  lastViewed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListWebInvestmentsResponse {
  investments: WebInvestmentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}

export interface ListWebInvestmentsQueryParams {
  page?: number;
  limit?: number;
  farmCategoryId?: string;
  riskLevel?: string;
  duration?: string;
  durationValue?: number;
  durationUnit?: string;
  location?: string;
  fundingStatus?: string;
  search?: string;
}

export interface WebInvestmentMilestone {
  id: string;
  userFarmMilestoneId: string;
  milestoneId: string;
  name: string;
  order: number;
  amount: number;
  isCompleted: boolean;
  status: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebInvestmentDetails {
  id: string;
  farmId: string;
  farmName: string;
  image: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  } | null;
  imageUrl: string | null;
  images: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  }[];
  farmCategory: {
    id: string;
    name: string;
  };
  investmentTemplate: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  roi: number;
  roiPercentage: number;
  startDate: string;
  endDate: string;
  duration: {
    value: number;
    unit: string;
    label: string;
  };
  riskLevel: string;
  farmOwner: {
    id: string;
    name: string;
  };
  farmOwnerName: string;
  rating: number | null;
  fundingReceived: number;
  totalExpectedFunding: number;
  location: string;
  percentFunded: number;
  minimumInvest: number;
  fundingStatus: string;
  currency: string;
  lastViewed: string | null;
  Investment?: {
    amount?: number;
    id?: string;
    status?: string;
  };
  milestones: WebInvestmentMilestone[];
  milestoneStats: {
    totalMilestones: number;
    completedMilestones: number;
    inProgressMilestones: number;
    notStartedMilestones: number;
    completionPercentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestPayload {
  amount: number;
  currency: string;
  idempotencyKey: string;
}

export interface InvestResponse {
  payment: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    gateway: string;
    status: string;
  };
  investment: {
    farmId: string;
    fundingReceived: number;
    totalExpectedFunding: number;
    remainingFunding: number;
    percentFunded: number;
    fundingStatus: string;
  };
  gateway: {
    provider: string;
    initialized: boolean;
  };
}
