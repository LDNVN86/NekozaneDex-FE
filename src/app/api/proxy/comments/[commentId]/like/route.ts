import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 }
    );
  }

  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:9091";
    const response = await fetch(
      `${backendUrl}/api/comments/${commentId}/like`,
      {
        method: "POST",
        headers: {
          Cookie: `access_token=${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Like proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể thích" },
      { status: 500 }
    );
  }
}
