import { NextResponse } from "next/server";

const BANK_DIRECTORY_URL = "https://nigerianbanks.xyz/";

export async function GET() {
  try {
    const response = await fetch(BANK_DIRECTORY_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to load bank directory" },
        { status: response.status }
      );
    }

    const banks = (await response.json()) as unknown;

    if (!Array.isArray(banks)) {
      return NextResponse.json(
        { message: "Unexpected bank directory response" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Bank directory retrieved successfully",
      data: banks,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load bank directory" },
      { status: 502 }
    );
  }
}