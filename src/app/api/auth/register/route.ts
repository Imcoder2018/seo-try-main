import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // This endpoint is deprecated - use Clerk for authentication
  return NextResponse.json(
    { error: "Please use Clerk for authentication. Sign up at /sign-up" },
    { status: 410 }
  );
}
