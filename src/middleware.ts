import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.redirect(new URL("/cms", request.url));
      }

      // Chỉ staff và admin mới được truy cập /cms
      if (
        pathname.startsWith("/cms") &&
        userRole !== "staff" &&
        userRole !== "admin"
      ) {
        // Parent chuyển hướng về /dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      // Nếu có lỗi xảy ra khi xử lý token, chuyển hướng về trang đăng nhập
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Hàm giải mã JWT token (đơn giản)
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return { role: null };
  }
}

// Chỉ áp dụng middleware cho các trang cụ thể
export const config = {
  matcher: ["/cms/:path*", "/dashboard/:path*"],
};
