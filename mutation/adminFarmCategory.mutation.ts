import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategoryById,
	updateCategory,
} from "@/api";
import { FarmCategoryPayload } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
	return useQuery({
		queryKey: ["farmCategories"],
		queryFn: () => getCategories(),
	});
};

export const useGetCategoryById = (categoryId?: string) => {
	return useQuery({
		queryKey: ["farmCategory", categoryId],
		queryFn: () => getCategoryById(categoryId!),
		enabled: !!categoryId,
	});
};

export const useCreateCategory = () => {
	return useMutation({
		mutationFn: (payload: FarmCategoryPayload) => createCategory(payload),
	});
};

export const useUpdateCategory = () => {
	return useMutation({
		mutationFn: ({
			categoryId,
			payload,
		}: {
			categoryId: string;
			payload: Partial<FarmCategoryPayload>;
		}) => updateCategory(categoryId, payload),
	});
};

export const useDeleteCategory = () => {
	return useMutation({
		mutationFn: (categoryId: string) => deleteCategory(categoryId),
	});
};
