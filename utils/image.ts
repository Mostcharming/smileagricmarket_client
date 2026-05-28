export const getPreviewImageUrl = (url?: string): string => {
  if (!url) return "";

  if (url.startsWith("/api/image-proxy")) {
    try {
      const proxyUrl = new URL(url, "https://app.smileagrimarket.com");
      const innerUrl = proxyUrl.searchParams.get("url");

      if (innerUrl) {
        return getPreviewImageUrl(decodeURIComponent(innerUrl));
      }
    } catch {
      return url;
    }
  }

  if (url.startsWith("/")) return url;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "app.smileagrimarket.com" && parsedUrl.pathname.startsWith("/api/v1/upload/")) {
      if (process.env.NODE_ENV !== "production") {
        return `/api/image-proxy?url=${encodeURIComponent(parsedUrl.toString())}`;
      }

      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "https:";
      }

      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
};