import Cookies from "js-cookie";
import { profileSchema } from "@/types";

const cookieName = "smileAgrimarketCookie";
const userStorageKey = "smileAgrimarketUser";

export const setCookie = async (data: string) => {
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
    Cookies.set(cookieName, data, {
        sameSite: isSecure ? "None" : "Lax",
        expires: 7,
        secure: isSecure,
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

export const setStoredRole = (role: string) => {
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
    Cookies.set("smileAgrimarketRole", role, {
        sameSite: isSecure ? "None" : "Lax",
        expires: 7,
        secure: isSecure,
    });
};

export const getStoredRole = () => {
    return Cookies.get("smileAgrimarketRole");
};

export const removeStoredRole = () => {
    Cookies.remove("smileAgrimarketRole");
};

export const clearAuthSession = () => {
    removeCookie();
    removeStoredUser();
    removeStoredRole();
};

export const signOut = (redirectPath: string) => {
    if (typeof window === "undefined") return;

    clearAuthSession();
    window.location.replace(redirectPath);
};