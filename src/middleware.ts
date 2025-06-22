import { NextRequest, NextResponse } from "next/server";
import { parseJwt } from "./lib/api/auth/token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Lấy URL đăng nhập
  const loginUrl = new URL("/login", request.url);

  // Nếu người dùng đã đăng nhập
  if (token) {
    try {
      // Giải mã token để kiểm tra role (đây chỉ là ví dụ, bạn cần triển khai logic giải mã JWT)
      const tokenData = parseJwt(token);
      const userRole = tokenData.role;

      // Chỉ parent mới được truy cập /dashboard
      if (pathname.startsWith("/dashboard") && userRole !== "parent") {
        // Staff và admin chuyển hướng về /cms
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname.startsWith("/cms") && userRole !== "admin" && userRole !== "staff") {
        // Staff và admin chuyển hướng về /cms
        return NextResponse.redirect(new URL("/", request.url));
      }

    } catch (error) {
      console.error("Error parsing JWT token:", error);
      // Nếu có lỗi xảy ra khi xử lý token, chuyển hướng về trang đăng nhập
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}


// Chỉ áp dụng middleware cho các trang cụ thể
export const config = {
  matcher: ["/cms/:path*", "/dashboard/:path*"],
};
