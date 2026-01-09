// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import type { ApiResponse, AuthUser } from "@/features/auth/types/auth";

// const DEFAULT_BACKEND_URL = "http://api.local.shopacgiare.io.vn:9091";

// const getBackendBaseUrl = () => {
//   return (
//     process.env.BACKEND_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     DEFAULT_BACKEND_URL
//   );
// };

// const buildCookieHeader = () => {
//   const cookieStore = cookies();
//   const allCookies = cookieStore.getAll();
//   if (allCookies.length === 0) {
//     return "";
//   }

//   return allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
// };

// export const getCurrentUser = async (): Promise<AuthUser | null> => {
//   const cookieHeader = buildCookieHeader();
//   if (!cookieHeader) {
//     return null;
//   }

//   const response = await fetch(`${getBackendBaseUrl()}/api/auth/profile`, {
//     method: "GET",
//     headers: {
//       cookie: cookieHeader,
//     },
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     return null;
//   }

//   const payload = (await response.json().catch(() => null)) as ApiResponse<AuthUser> | null;
//   if (!payload?.success || !payload.data) {
//     return null;
//   }

//   return payload.data;
// };

// type RequireUserOptions = {
//   roles?: string[];
//   redirectTo?: string;
//   forbiddenRedirect?: string;
// };

// export const requireUser = async (options: RequireUserOptions = {}) => {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect(options.redirectTo ?? "/auth/login");
//   }

//   if (options.roles && !options.roles.includes(user.role)) {
//     redirect(options.forbiddenRedirect ?? "/");
//   }

//   return user;
// };
