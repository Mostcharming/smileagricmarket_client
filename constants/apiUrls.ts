export const authUrl = {
    requestOtp: () => `/web/auth/request-otp`,
    verifyOtp: () => `/web/auth/verify-otp`,
    completeUserProfile: () => `/web/auth/complete-profile`,
    setPassword: () => `/web/auth/set-password`,
    loginPassword: () => `/web/auth/login`,
    forgotPassword: () => `/web/auth/forgot-password`,
    resetPassword: () => `/web/auth/reset-password`,
};

export const kycUrl = {
    submitKyc: () => `/web/kyc/submit`,
    getKycStatus: () => `/web/kyc/status`,
    updateKyc: () => `/web/kyc/update`,
};

export const adminUrl = {
    adminLogin: () => `/web/admin/login`,
    getUsers: (query: string) => `/web/admin/users${query}`,
    getKycDetails: (userId: string) => `/web/admin/users/${userId}/kyc`,
    approveKyc: () => `/web/admin/kyc/approve`,
    rejectKyc: () => `/web/admin/kyc/reject`,
};

export const adminFarmCategories = {
    createCategory: () => `/web/admin/farm-categories`,
    getCategory: () => `/web/admin/farm-categories`,
    getCategoryById: (categoryId: string) => `/web/admin/farm-categories/${categoryId}`,
    updateCategory: (categoryId: string) => `/web/admin/farm-categories/${categoryId}`,
    deleteCategory: (categoryId: string) => `/web/admin/farm-categories/${categoryId}`,
};

export const adminMilestones = {
    createMilestone: (categoryId: string) => `/web/admin/farm-categories/${categoryId}/milestones`,
    getMilestonesByCategory: (categoryId: string) => `/web/admin/farm-categories/${categoryId}/milestones`,
    getMilestones: () => `/web/admin/milestones`,
    updateMilestone: (milestoneId: string) => `/web/admin/milestones/${milestoneId}`,
    deleteMilestone: (milestoneId: string) => `/web/admin/milestones/${milestoneId}`,
    deleteAllMilestonesByCategory: (categoryId: string) => `/web/admin/farm-categories/${categoryId}/milestones/delete-all`,
};