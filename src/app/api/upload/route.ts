import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const formData = await req.formData();

    // Forward to backend - processing done in Go
    const res = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Handle non-JSON response
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      console.error(
        "[Upload Proxy] Non-JSON response:",
        text.substring(0, 200)
      );
      return NextResponse.json(
        { error: "Upload service không khả dụng" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Upload thất bại" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Upload Proxy] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi khi upload ảnh" },
      { status: 500 }
    );
  }
}
