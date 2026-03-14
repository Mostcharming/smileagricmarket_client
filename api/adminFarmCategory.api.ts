import { adminFarmCategories } from "@/constants";
import { get, post, put, remove } from "@/utils";
import {
	ApiResponse,
	DeleteResourceResponse,
	FarmCategoryPayload,
	FarmCategoryResponse,
} from "@/types";

export const createCategory = async (
	payload: FarmCategoryPayload
): Promise<ApiResponse<FarmCategoryResponse>> => {
	const response = await post<FarmCategoryResponse>(
		adminFarmCategories.createCategory(),
		payload
	);
	return response;
};

export const getCategories = async (): Promise<
	ApiResponse<FarmCategoryResponse[]>
> => {
	const response = await get<FarmCategoryResponse[]>(
		adminFarmCategories.getCategory()
	);
	return response;
};

export const getCategoryById = async (
	categoryId: string
): Promise<ApiResponse<FarmCategoryResponse>> => {
	const response = await get<FarmCategoryResponse>(
		adminFarmCategories.getCategoryById(categoryId)
	);
	return response;
};

export const updateCategory = async (
	categoryId: string,
	payload: Partial<FarmCategoryPayload>
): Promise<ApiResponse<FarmCategoryResponse>> => {
	const response = await put<FarmCategoryResponse>(
		adminFarmCategories.updateCategory(categoryId),
		payload
	);
	return response;
};

export const deleteCategory = async (
	categoryId: string
): Promise<ApiResponse<DeleteResourceResponse>> => {
	const response = await remove<DeleteResourceResponse>(
		adminFarmCategories.deleteCategory(categoryId)
	);
	return response;
};
