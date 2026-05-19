import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["app.smileagrimarket.com"]);
const ALLOWED_PATH_PREFIX = "/api/v1/upload/";

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ message: "Missing url" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ message: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname) || !parsedUrl.pathname.startsWith(ALLOWED_PATH_PREFIX)) {
    return NextResponse.json({ message: "URL not allowed" }, { status: 403 });
  }

  const upstreamResponse = await fetch(parsedUrl.toString(), {
    cache: "no-store",
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return NextResponse.json({ message: "Unable to load image" }, { status: upstreamResponse.status || 502 });
  }

  const headers = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const cacheControl = upstreamResponse.headers.get("cache-control");

  if (contentType) headers.set("content-type", contentType);
  if (cacheControl) headers.set("cache-control", cacheControl);
  headers.set("cross-origin-resource-policy", "cross-origin");

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}