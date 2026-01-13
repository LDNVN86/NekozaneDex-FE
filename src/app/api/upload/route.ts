import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

async function getToken(req: NextRequest): Promise<string | null> {
  const headersList = await headers();
  const refreshedToken = headersList.get("x-refreshed-access-token");
  if (refreshedToken) return refreshedToken;

  return req.cookies.get("access_token")?.value ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken(req);

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const formData = await req.formData();

    const res = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

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
