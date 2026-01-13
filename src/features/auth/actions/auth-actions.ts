"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/shared/lib/server-auth";
import { ok, err, type Result } from "@/response/response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
export interface AuthActionState {
  success: boolean;
  message: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    username?: string;
  };
  values?: {
    email?: string;
    username?: string;
  };
}

const validateEmail = (email: string): string | null => {
  if (!email) return "Email không được để trống";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  return null;
};

const validateUsername = (username: string): string | null => {
  if (!username) return "Tên hiển thị không được để trống";
  if (username.length < 3) return "Tên hiển thị phải có ít nhất 3 ký tự";
  if (username.length > 50) return "Tên hiển thị không được quá 50 ký tự";
  return null;
};

const parseCookieString = (
  cookieString: string
): { name: string; value: string } | null => {
  const [nameValue] = cookieString.split(";");
  if (!nameValue) return null;

  const equalIndex = nameValue.indexOf("=");
  if (equalIndex === -1) return null;

  const name = nameValue.slice(0, equalIndex).trim();
  const value = nameValue.slice(equalIndex + 1).trim();

  return { name, value };
};

export async function loginAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fieldErrors: AuthActionState["fieldErrors"] = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Email hoặc mật khẩu không đúng",
      };
    }

    const setCookies = response.headers.getSetCookie();
    const cookieStore = await cookies();

    console.log(
      "[loginAction] Set-Cookie headers received:",
      setCookies.length
    );

    for (const cookie of setCookies) {
      const parsed = parseCookieString(cookie);
      if (parsed) {
        // Extract maxAge from backend cookie
        const maxAge = extractMaxAge(cookie);

        console.log(
          "[loginAction] Setting cookie:",
          parsed.name,
          "maxAge:",
          maxAge
        );

        cookieStore.set(parsed.name, parsed.value, {
          ...COOKIE_OPTIONS,
          maxAge: maxAge ?? COOKIE_OPTIONS.maxAge,
        });
      }
    }

    return {
      success: true,
      message: "Đăng nhập thành công",
    };
  } catch (error) {
    console.error("[loginAction] Error:", error);
    return {
      success: false,
      message: "Lỗi kết nối server. Vui lòng thử lại sau.",
    };
  }
}

function extractMaxAge(cookieString: string): number | undefined {
  const match = cookieString.match(/max-age=(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

export async function registerAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const fieldErrors: AuthActionState["fieldErrors"] = {};
  const emailError = validateEmail(email);
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);

  if (emailError) fieldErrors.email = emailError;
  if (usernameError) fieldErrors.username = usernameError;
  if (passwordError) fieldErrors.password = passwordError;

  if (password && confirmPassword && password !== confirmPassword) {
    fieldErrors.password = "Mật khẩu xác nhận không khớp";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors,
      values: { email, username },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.error ||
          errorData.message ||
          "Đăng ký thất bại. Vui lòng thử lại.",
        values: { email, username },
      };
    }

    return {
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
    };
  } catch (error) {
    console.error("[registerAction] Error:", error);
    return {
      success: false,
      message: "Lỗi kết nối server. Vui lòng thử lại sau.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = await getAccessToken();

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `access_token=${token}`,
        },
      });
    } catch (error) {
      console.error("[logoutAction] Backend logout error:", error);
    }
  }

  const authCookies = ["access_token", "refresh_token", "csrf_token"];
  for (const cookieName of authCookies) {
    cookieStore.delete(cookieName);
  }

  redirect("/");
}

export async function loginActionResult(
  formData: FormData
): Promise<Result<{ message: string }, string>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return err("Vui lòng điền đầy đủ thông tin");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return err(data.message || "Đăng nhập thất bại");
    }

    const setCookies = response.headers.getSetCookie();
    const cookieStore = await cookies();

    for (const cookie of setCookies) {
      const parsed = parseCookieString(cookie);
      if (parsed) {
        cookieStore.set(parsed.name, parsed.value, COOKIE_OPTIONS);
      }
    }

    return ok({ message: "Đăng nhập thành công" });
  } catch {
    return err("Lỗi kết nối server");
  }
}

export async function registerActionResult(
  formData: FormData
): Promise<Result<{ message: string }, string>> {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!email || !username || !password) {
    return err("Vui lòng điền đầy đủ thông tin");
  }

  if (password.length < 8) {
    return err("Mật khẩu phải có ít nhất 8 ký tự");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return err(data.message || "Đăng ký thất bại");
    }

    return ok({ message: "Đăng ký thành công" });
  } catch {
    return err("Lỗi kết nối server");
  }
}
