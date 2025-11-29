import Cookies from "js-cookie";

const cookieName = "smileAgrimarketCookie";

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