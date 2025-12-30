export interface KycPayload {
    identificationType: string;
    identificationNumber: string;
    selfie: string;
}

export interface KycResponse {
    kycId?: string;
    status?: string;
    submittedAt?: string;
    verifiedAt?: string;
    identificationType?: string;
    rejectionReason?: string;
    selfie?: string;
}