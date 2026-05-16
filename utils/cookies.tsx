import Cookies from "js-cookie";
import { profileSchema } from "@/types";

const cookieName = "smileAgrimarketCookie";
const userStorageKey = "smileAgrimarketUser";

export const setCookie = async (data: string) => {
    Cookies.set(cookieName, data, {
        sameSite: "None",
        expires: 7,
        secure: true,
    });
};

export const getCookie = () => {
    return Cookies.get(cookieName);
};

export const removeCookie = () => {
    Cookies.remove(cookieName);
};

export const setStoredUser = (user?: profileSchema) => {
    if (typeof window === "undefined") return;
    if (!user) {
        localStorage.removeItem(userStorageKey);
        return;
    }

    localStorage.setItem(userStorageKey, JSON.stringify(user));
};

export const getStoredUser = (): profileSchema | null => {
    if (typeof window === "undefined") return null;

    const rawUser = localStorage.getItem(userStorageKey);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser) as profileSchema;
    } catch {
        localStorage.removeItem(userStorageKey);
        return null;
    }
};

export const removeStoredUser = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(userStorageKey);
};

export const clearAuthSession = () => {
    removeCookie();
    removeStoredUser();
};

export const signOut = (redirectPath: string) => {
    if (typeof window === "undefined") return;

    clearAuthSession();
    window.location.replace(redirectPath);
};