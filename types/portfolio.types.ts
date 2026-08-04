export interface PortfolioTrend {
  direction: "up" | "down" | "flat" | string;
  percentage: number;
  change: number;
  currentMonth: number;
  previousMonth: number;
  comparison: string;
}

export interface PortfolioBreakdown {
  currency: string;
  amount: number;
}

export interface PortfolioTotalAmount {
  amount: number;
  currency: string;
  breakdown: PortfolioBreakdown[];
  trend: PortfolioTrend;
}

export interface PortfolioTotalFarms {
  count: number;
  trend: PortfolioTrend;
}

export interface PortfolioSummary {
  totalInvested: PortfolioTotalAmount;
  totalFarmsInvested: PortfolioTotalFarms;
  totalExpectedReturns: PortfolioTotalAmount;
  totalEarnedReturns: PortfolioTotalAmount;
}

export interface PortfolioData {
  asOf: string;
  summary: PortfolioSummary;
}

export type GetPortfolioResponse = PortfolioData;

export interface PortfolioFarmCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  milestoneCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFarmOwner {
  id: string;
  name: string;
  bio: string;
  profileImageUrl: string;
}

export interface PortfolioDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFunding {
  id: string;
  expectedInvestment: number;
  investmentReceived: number;
  investmentPending: number;
  currency: string;
  status: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioMilestone {
  id: string;
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

export interface PortfolioMilestoneStats {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
}

export interface PortfolioUserInvestment {
  amountInvested: number;
  expectedReturns: number;
  earnedReturns: number;
  currency: string;
  breakdown: {
    currency: string;
    amountInvested: number;
    expectedReturns: number;
    earnedReturns: number;
  }[];
  transactionCount: number;
  activeTransactionCount: number;
  completedTransactionCount: number;
  firstInvestedAt: string;
  lastInvestedAt: string;
}

export interface PortfolioTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  gateway: string;
  gatewayReference: string;
  paymentStatus: string;
  portfolioStatus: string;
  expectedReturn: number;
  earnedReturn: number;
  paidAt: string;
  investedAt: string;
  effectiveEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioInvestmentTemplate {
  id: string;
  farmCategoryId: string;
  farmCategory: PortfolioFarmCategory;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  roiPercentage: number;
  durationValue: number;
  durationUnit: string;
  duration: {
    value: number;
    unit: string;
    label: string;
  };
  riskLevel: string;
  fundingRules: {
    minGoal: number;
    maxGoal: number;
    currency: string;
  };
  investmentLimit: {
    minGoal: number;
    maxGoal: number;
    currency: string;
  };
  currency: string;
  isActive: boolean;
  milestones: {
    id: string;
    investmentId: string;
    name: string;
    fundReleasePercentage: number;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  portfolioStatus: string;
  amountInvested: number;
  expectedReturns: number;
  earnedReturns: number;
  transactions: PortfolioTransaction[];
}

export interface PortfolioFarm {
  id: string;
  farmId: string;
  name: string;
  description: string;
  location: string;
  size: number;
  currency: string;
  isActive: boolean;
  verificationStatus: string;
  rejectionNote: string;
  createdAt: string;
  updatedAt: string;
  category: PortfolioFarmCategory;
  owner: PortfolioFarmOwner;
  image: PortfolioDocument | null;
  images: PortfolioDocument[];
  documents: PortfolioDocument[];
  funding: PortfolioFunding;
  milestones: PortfolioMilestone[];
  milestoneStats: PortfolioMilestoneStats;
  portfolioStatus: "active" | "completed";
  userInvestment: PortfolioUserInvestment;
  investments: PortfolioInvestmentTemplate[];
}

export interface PortfolioFarmsData {
  status: string;
  total: number;
  farms: PortfolioFarm[];
}

export type GetPortfolioFarmsResponse = PortfolioFarmsData;

export interface PortfolioFarmsQueryParams {
  status?: "active" | "completed";
}

export type GetPortfolioFarmByIdResponse = PortfolioFarm;
