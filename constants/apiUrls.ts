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