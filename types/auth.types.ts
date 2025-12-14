export interface AuthPayload {
  phoneNumber?: string;
  otp?: string;
  fullName?: string;
  gender?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

export interface AuthResponse {
  phoneNumber: string;
  userId: string;
  token: string;
  isNewUser: boolean;
};

export interface ProfileResponse {
  token: string;
  user: profileSchema;
};

export interface profileSchema {
  id: string;
  phoneNumber: string;
  fullName: string;
  email: string;
  gender: string;
};