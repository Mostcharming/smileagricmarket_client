const PROXY_PREFIX = "/api/image-proxy?url=";

export const getPreviewImageUrl = (url?: string) => {
  if (!url) return "";

  if (url.startsWith("/")) return url;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "app.smileagrimarket.com" && parsedUrl.pathname.startsWith("/api/v1/upload/")) {
      return `${PROXY_PREFIX}${encodeURIComponent(url)}`;
    }

    return url;
  } catch {
    return url;
  }
};