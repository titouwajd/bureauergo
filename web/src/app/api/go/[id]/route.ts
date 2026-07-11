import { NextRequest, NextResponse } from "next/server";
import { getAffiliateUrl, logAffiliateClick } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const url = await getAffiliateUrl(itemId);
    if (!url) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const ip = request.headers.get("x-forwarded-for") || undefined;
    const ua = request.headers.get("user-agent") || undefined;
    await logAffiliateClick(itemId, ip, ua);

    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
