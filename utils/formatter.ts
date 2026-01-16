/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildQueryString = (filters: Record<string, any>): string => {
    const params = new URLSearchParams();

    const appendParam = (key: string, value: any) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item !== undefined && item !== null && item !== "") {
                    params.append(key, String(item));
                }
            });
        } else if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                if (
                    nestedValue !== undefined &&
                    nestedValue !== null &&
                    nestedValue !== ""
                ) {
                    params.append(`${key}[${nestedKey}]`, String(nestedValue));
                }
            });
        } else if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    };

    Object.entries(filters).forEach(([key, value]) => appendParam(key, value));

    return `?${params.toString()}`;
};