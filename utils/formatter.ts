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

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
};

export const formatNumberWithCommas = (value: string | number): string => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return String(value);
    }

    return numericValue.toLocaleString("en-NG");
};

export const formatFarmCategory = (farm: any): string => {
    if (!farm) return 'Uncategorized';

    if (farm.Category?.name) return farm.Category.name;
    if (farm.category?.name) return farm.category.name;
    if (farm.farmCategory?.name) return farm.farmCategory.name;
    if (typeof farm.Category === 'string' && farm.Category.trim()) return farm.Category.trim();
    if (typeof farm.category === 'string' && farm.category.trim()) return farm.category.trim();
    if (typeof farm.farmCategory === 'string' && farm.farmCategory.trim()) return farm.farmCategory.trim();

    const projects =
        farm.InvestmentProjects ||
        farm.investmentProjects ||
        (farm.investmentProject ? [farm.investmentProject] : farm.InvestmentProject ? [farm.InvestmentProject] : []);

    if (Array.isArray(projects) && projects.length > 0) {
        const categoriesSet = new Set<string>();

        for (const proj of projects) {
            const catName =
                proj?.Category?.name ||
                proj?.category?.name ||
                proj?.farmCategory?.name ||
                (typeof proj?.Category === 'string' ? proj.Category : '') ||
                (typeof proj?.category === 'string' ? proj.category : '') ||
                (typeof proj?.farmCategory === 'string' ? proj.farmCategory : '');

            if (catName && catName.trim()) {
                categoriesSet.add(catName.trim());
            }
        }

        if (categoriesSet.size > 0) {
            return Array.from(categoriesSet).join(', ');
        }
    }

    return 'Uncategorized';
};

export const truncateMiddle = (str?: string, startChars: number = 4, endChars: number = 4): string => {
    if (!str) return '';
    if (str.length <= startChars + endChars + 3) return str;
    return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
};