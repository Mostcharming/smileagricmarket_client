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