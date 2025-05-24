import { NextResponse } from "next/server";

// Trong một ứng dụng thực tế, bạn sẽ sử dụng một middleware để xác thực token
// và truy xuất thông tin người dùng từ database
export async function GET(request: Request) {
  // Lấy token từ header Authorization
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Trong một ứng dụng thực tế, bạn sẽ xác thực token ở đây
    // Ví dụ: const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Để giả lập, chỉ kiểm tra nếu token có tồn tại
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } // Giả lập lấy dữ liệu người dùng từ token
    // Trong trường hợp thực tế, bạn sẽ lấy ID người dùng từ token đã giải mã
    // và truy vấn database để lấy thông tin người dùng
    const tokenParts = token.split("-");
    // Dựa vào cấu trúc token: mock-jwt-token-${user.id}-${Date.now()}
    // userId nằm ở vị trí thứ 3 (index 2)
    const userId = parseInt(tokenParts[2], 10);

    // Mock users data (thông thường sẽ lấy từ database)
    const users = [
      {
        id: 1,
        email: "nguyenvana@example.com",
        role: "parent",
      },
      {
        id: 2,
        email: "tranthib@example.com",
        role: "parent",
      },
      {
        id: 3,
        email: "staff@example.com",
        role: "staff",
      },
    ];

    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
