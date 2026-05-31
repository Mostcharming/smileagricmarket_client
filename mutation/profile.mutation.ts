import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getWebBanks,
  getWebProfile,
  getWebProfileCompletionStatus,
  getWebProfileWallet,
  setupWebProfileWallet,
  updateWebProfile,
  uploadWebProfilePicture,
} from "@/api";
import { WebProfilePayload, WebProfileWalletPayload } from "@/types";

export const useGetWebProfile = () => {
  return useQuery({
    queryKey: ["webProfile"],
    queryFn: () => getWebProfile(),
  });
};

export const useGetWebProfileCompletionStatus = () => {
  return useQuery({
    queryKey: ["webProfileCompletionStatus"],
    queryFn: () => getWebProfileCompletionStatus(),
  });
};

export const useUpdateWebProfile = () => {
  return useMutation({
    mutationFn: (payload: WebProfilePayload) => updateWebProfile(payload),
  });
};

export const useUploadWebProfilePicture = () => {
  return useMutation({
    mutationFn: (payload: FormData) => uploadWebProfilePicture(payload),
  });
};

export const useSetupWebProfileWallet = () => {
  return useMutation({
    mutationFn: (payload: WebProfileWalletPayload) => setupWebProfileWallet(payload),
  });
};

export const useGetWebProfileWallet = () => {
  return useQuery({
    queryKey: ["webProfileWallet"],
    queryFn: () => getWebProfileWallet(),
  });
};

export const useGetWebBanks = () => {
  return useQuery({
    queryKey: ["webBanks"],
    queryFn: () => getWebBanks(),
  });
};