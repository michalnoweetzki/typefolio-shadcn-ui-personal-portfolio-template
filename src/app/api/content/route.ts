import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const content = await saveSiteContent(payload);
  return NextResponse.json(content);
}
