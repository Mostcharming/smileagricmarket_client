export interface UsersDirectory {
    users: UsersApiResponse[];
    pagination: UsersPagination;
};

export interface UsersApiResponse {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    kycStatus?: string;
    kycSubmittedAt?: string;
    kycVerifiedAt?: string;
    createdAt: string;
    profileImageUrl?: string;
    nin?: string;
};

export interface UsersPagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface UsersDetailsDirectory {
    users: UsersApiResponse;
    kyc: kycDetailsResponse;
    kycStatus: string;
};

export interface AdminKycDetailsResponse {
    user: AdminKycUserDetails;
    kyc: kycDetailsResponse;
    kycStatus: string;
};

export interface AdminKycUserDetails {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
};

export interface kycDetailsResponse {
    id: string;
    identificationType: string;
    identificationNumber: string;
    idDocumentUrl: string;
    selfieImageUrl: string;
    status: string;
    rejectionReason?: string;
    submittedAt: string;
    verifiedAt?: string;
    verifiedBy?: string;
};

export interface kycSubmissionResponse {
    kycId: string;
    status: string;
    rejectionReason?: string;
    verifiedAt?: string;
    verifiedBy?: string;
};

export interface kycPayload {
    kycId: string;
    rejectionReason?: string;
};

export interface FarmCategoryPayload {
    name: string;
    description?: string;
}

export interface MilestonePayload {
    name: string;
    order?: number;
}

export interface MilestoneBulkPayload {
    milestones: MilestonePayload[];
}

export interface DeleteResourceResponse {
    id?: string;
    categoryId?: string;
    deletedCount?: number;
}

// User Investments & Milestone Reviews Types
export interface ListUserInvestmentsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'not_started' | 'funding_started' | 'active' | 'completed' | string;
    investmentId?: string;
    farmCategoryId?: string;
    farmId?: string;
    userId?: string;
    maturityFrom?: string;
    maturityTo?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface UserInvestmentItem {
    id: string;
    displayId?: string;
    investorName?: string;
    farmLine1?: string;
    farmName?: string;
    amountInvested?: string | number;
    maturityDate?: string;
    rawMaturityDate?: string;
    durationText?: string;
    duration?: string | { value: number; unit: string; label: string };
    durationValue?: number;
    durationUnit?: string;
    startDate?: string;
    endDate?: string;
    status: 'not_started' | 'funding_started' | 'active' | 'completed' | string;
    user?: {
        id: string;
        fullName?: string;
        name?: string;
        email?: string;
    };
    farm?: {
        id: string;
        name?: string;
        location?: string;
    };
    farmCategory?: {
        id: string;
        name?: string;
    };
    amount?: number;
    currency?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ListUserInvestmentsResponse {
    userInvestments?: UserInvestmentItem[];
    investments?: UserInvestmentItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers?: number;
        totalInvestments?: number;
        totalItems?: number;
        total?: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface ListUserInvestmentMilestonesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    reviewStatus?: 'pending' | 'approved' | 'rejected' | 'more_evidence_required' | string;
    fundingStatus?: 'request_for_funding' | 'processing_funding' | 'completed' | string;
    investmentStatus?: 'not_started' | 'funding_started' | 'active' | 'completed' | string;
    checklistStatus?: 'verified' | 'needs_clarification' | 'rejected' | string;
    investmentId?: string;
    investmentProjectId?: string;
    milestoneId?: string;
    farmCategoryId?: string;
    farmId?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmountRequested?: number;
    maxAmountRequested?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface UserInvestmentMilestonesMetrics {
    milestonesPendingReview?: number;
    pendingReviewCount?: number;
    totalDisbursed?: number;
    totalInEscrow?: number;
}

export interface UserInvestmentMilestoneItem {
    id: string;
    milestoneId?: string;
    investmentId?: string;
    investmentProjectId?: string;
    farmName?: string;
    farmerName?: string;
    milestoneTitle?: string;
    name?: string;
    cropCategory?: string;
    amountRequested?: string | number;
    currency?: string;
    submissionDate?: string;
    rawDate?: string;
    reviewStatus?: 'pending' | 'approved' | 'rejected' | 'more_evidence_required' | string;
    fundingStatus?: 'request_for_funding' | 'processing_funding' | 'completed' | string;
    investmentStatus?: 'not_started' | 'funding_started' | 'active' | 'completed' | string;
    checklistStatus?: 'verified' | 'needs_clarification' | 'rejected' | string;
    status?: string;
    user?: {
        id?: string;
        fullName?: string;
        email?: string;
        phoneNumber?: string;
    };
    farm?: {
        id?: string;
        name?: string;
        location?: string;
        size?: number;
    };
    investment?: {
        id?: string;
        name?: string;
        description?: string;
        roiPercentage?: string | number;
        maturityDate?: string;
    };
    investmentProject?: {
        id?: string;
        fundingGoalAmount?: number;
        amountInvestedSoFar?: number;
        amountRemaining?: number;
        startDate?: string;
        maturityDate?: string;
        status?: string;
    };
    farmCategory?: {
        id?: string;
        name?: string;
        description?: string;
    };
    milestone?: {
        id?: string;
        investmentId?: string;
        name?: string;
        fundReleasePercentage?: string | number;
        order?: number;
    };
}

export interface MetricTrend {
    currentYear?: number;
    previousYear?: number;
    change?: number;
    displayChange?: string;
    percentageChange?: number;
    direction?: 'up' | 'down' | 'unchanged' | 'same' | string;
}

export interface SummaryMetricItem {
    count?: number;
    amount?: number;
    trend?: MetricTrend;
}

export interface UserInvestmentMilestonesSummary {
    pendingMilestones?: SummaryMetricItem;
    totalDisbursed?: SummaryMetricItem;
    totalInEscrow?: SummaryMetricItem;
}

export interface ListUserInvestmentMilestonesResponse {
    milestones?: UserInvestmentMilestoneItem[];
    userInvestmentMilestones?: UserInvestmentMilestoneItem[];
    summary?: UserInvestmentMilestonesSummary;
    metrics?: UserInvestmentMilestonesMetrics;
    summaryMetrics?: UserInvestmentMilestonesMetrics;
    pagination: {
        currentPage?: number;
        page?: number;
        totalPages?: number;
        totalItems?: number;
        totalMilestones?: number;
        total?: number;
        limit?: number;
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
}

export interface UserInvestmentMilestoneChecklistItem {
    name: string;
    status: 'verified' | 'needs_clarification' | 'rejected' | 'unreviewed' | string;
    notes?: string;
}

export interface UserInvestmentMilestoneEvidenceItem {
    id?: string;
    userFarmMilestoneId?: string;
    type?: 'photo' | 'picture' | 'file' | 'document' | 'video' | string;
    evidenceType?: 'photo' | 'picture' | 'file' | 'document' | 'video' | string;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    title?: string;
    description?: string;
    fileSize?: number;
    mimeType?: string;
    capturedAt?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInvestmentMilestoneDocument {
    id: string;
    userFarmId?: string;
    documentType: 'picture' | 'document' | 'video' | string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInvestmentMilestoneUser {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt?: string;
}

export interface UserInvestmentMilestoneFarm {
    id: string;
    userId?: string;
    name: string;
    location: string;
    size?: number;
    isActive?: boolean;
    verificationStatus?: string;
    rejectionNote?: string | null;
    createdAt?: string;
    updatedAt?: string;
    User?: UserInvestmentMilestoneUser;
    Documents?: UserInvestmentMilestoneDocument[];
}

export interface UserInvestmentMilestoneTemplateItem {
    id: string;
    investmentId?: string;
    name: string;
    fundReleasePercentage: string | number;
    order: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInvestmentMilestoneTemplate {
    id: string;
    farmCategoryId?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    roiPercentage?: string | number;
    durationValue?: number;
    durationUnit?: string;
    riskLevel?: string;
    fundingMinGoal?: string | number;
    fundingMaxGoal?: string | number;
    investmentMinGoal?: string | number;
    investmentMaxGoal?: string | number;
    currency?: string;
    isActive?: boolean;
    Milestones?: UserInvestmentMilestoneTemplateItem[];
}

export interface UserInvestmentProjectMilestone {
    id: string;
    investmentMilestoneId?: string;
    name: string;
    order: number;
    fundReleasePercentage: string | number;
    amount: string | number;
    fundingStatus?: string;
    reviewStatus?: string;
    fundingRequestedAt?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    completedAt?: string | null;
}

export interface UserInvestmentProject {
    id: string;
    userFarmId?: string;
    farmCategoryId?: string;
    investmentId?: string;
    expectedInvestment?: string | number;
    investmentReceived?: string | number;
    investmentPending?: string | number;
    currency?: string;
    startDate?: string;
    endDate?: string;
    investmentStatus?: string;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    Farm?: UserInvestmentMilestoneFarm;
    InvestmentTemplate?: UserInvestmentMilestoneTemplate;
    Category?: {
        id: string;
        name: string;
        description?: string | null;
        isActive?: boolean;
    };
    ProjectMilestones?: UserInvestmentProjectMilestone[];
}

export interface UserInvestmentMilestoneDetail {
    id: string;
    userFarmId?: string;
    userFarmInvestmentId?: string;
    milestoneId?: string | null;
    investmentMilestoneId?: string;
    name?: string;
    fundReleasePercentage?: string | number;
    order?: number;
    fundingStatus?: string;
    reviewStatus?: string;
    fundingRequestedAt?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    isCompleted?: boolean;
    completedAt?: string | null;
    amount?: string | number;
    createdAt?: string;
    updatedAt?: string;

    InvestmentProject?: UserInvestmentProject;
    InvestmentMilestone?: UserInvestmentMilestoneTemplateItem;
    Reviewer?: any;
    FundingEvidence?: UserInvestmentMilestoneEvidenceItem[];
    VerificationChecklist?: UserInvestmentMilestoneChecklistItem[];
    ReviewAuditTrail?: Array<{
        id?: string;
        timestamp?: string;
        action?: string;
        title?: string;
        event?: string;
        description?: string;
        note?: string;
        comment?: string;
        actor?: string | { fullName?: string };
        reviewedBy?: string;
        User?: { fullName?: string };
        user?: { fullName?: string };
        reviewer?: string;
        createdAt?: string;
        created_at?: string;
    }>;
    amountRequested?: number | string;
    status?: string;
    otherMilestones?: UserInvestmentProjectMilestone[];

    farmName?: string;
    farmerName?: string;
    milestoneTitle?: string;
    cropCategory?: string;
    releasedAmount?: number;
    totalFarmFunding?: number;
    releasePercentage?: number;
    submissionDate?: string;
    rawDate?: string;
    checklistStatus?: 'verified' | 'needs_clarification' | 'rejected' | string;
    farmerNotes?: string;
    internalNotes?: string;
    evidence?: {
        photos?: UserInvestmentMilestoneEvidenceItem[];
        documents?: UserInvestmentMilestoneEvidenceItem[];
        videos?: UserInvestmentMilestoneEvidenceItem[];
    } | UserInvestmentMilestoneEvidenceItem[];
    previousMilestones?: Array<{
        id: string;
        title: string;
        amount: number | string;
        status: string;
        approvedAt?: string;
        approvedBy?: string;
    }>;
    milestoneSchedule?: Array<{
        id: string;
        order: number;
        title: string;
        percentage: number;
        amount: number | string;
        status: string;
    }>;
    auditTrail?: Array<{
        timestamp: string;
        action: string;
        description: string;
        actor: string;
        statusColor?: string;
    }>;
    checklist?: UserInvestmentMilestoneChecklistItem[];
    farmDetails?: {
        location?: string;
        sizeInHectares?: number;
        crop?: string;
        fundingCycle?: string;
    };
}

export interface UpdateMilestoneChecklistPayload {
    checklist: UserInvestmentMilestoneChecklistItem[];
    internalNotes?: string;
}

export interface ReviewMilestonePayload {
    action: 'approve' | 'reject' | 'request_more_evidence' | string;
    internalNotes?: string;
    checklist?: UserInvestmentMilestoneChecklistItem[];
}