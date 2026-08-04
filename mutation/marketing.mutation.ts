import { useMutation, useQuery } from "@tanstack/react-query";
import { getBetaSignups, marketingLogin, createBetaSignup } from "@/api";
import { AuthPayload, BetaSignupsFilter, BetaSignupPayload } from "@/types";

export const useMarketingLogin = () => {
    return useMutation({
        mutationFn: (payload: AuthPayload) => marketingLogin(payload),
    });
};

export const useGetBetaSignups = (filter: BetaSignupsFilter) => {
    return useQuery({
        queryKey: ["betaSignups", filter],
        queryFn: () => getBetaSignups(filter),
        refetchOnMount: false,
    });
};

export const useCreateBetaSignup = () => {
    return useMutation({
        mutationFn: (payload: BetaSignupPayload) => createBetaSignup(payload),
    });
};
