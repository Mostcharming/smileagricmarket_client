import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { ApiError, ApiResponse } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Global headers will be added here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headers: any = {};

const axiosInstance = axios.create({
    baseURL,
    headers,
});

const cookieName = "resvailCookie";

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get(cookieName); // always get fresh token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        throw handleAxiosError(error);
    }
);

// Handle Error response
export function handleAxiosError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        const backendMessage = error.response?.data?.message as
            | string
            | undefined;
        const message =
            backendMessage || error.message || "An unknown error occurred";

        const errors = error.response?.data?.errors;

        return {
            statusCode,
            message,
            errors,
            stack: error.stack,
        };
    }

    const e = error as Error;
    return {
        message: e.message,
        stack: e.stack,
    };
}

const handleResponse = <T,>(response: AxiosResponse): ApiResponse<T> => {
    return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
        success: response.data.success,
    };
};

export const get = async <T,>(
    url: string,
    config?: object
): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.get(url, config);
    return handleResponse<T>(res);
};

export const post = async <T,>(url: string, data?: object, config?: object) => {
    const res = await axiosInstance.post(url, data, config);
    return handleResponse<T>(res);
};

export const put = async <T,>(
    url: string,
    data?: object,
    config?: object
): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.put(url, data, config);
    return handleResponse<T>(res);
};

export const patch = async <T,>(
    url: string,
    data?: object,
    config?: object
): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.patch(url, data, config);
    return handleResponse<T>(res);
};

export const remove = async <T,>(
    url: string,
    data?: object,
    config?: object
): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.delete(url, {
        ...config,
        data,
    });
    return handleResponse<T>(res);
};

export default axiosInstance;