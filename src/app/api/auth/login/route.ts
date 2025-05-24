import { NextResponse } from "next/server";
import { RoleName } from "@/lib/roles";

// Mock data with passwords (in a real app, passwords would be hashed)
const users = [
  {
    id: "1",
    email: "nguyenvanb@example.com",
    password: "password123",
    role: "parent" as RoleName,
  },
  {
    id: "2",
    email: "tranthib@example.com",
    password: "password123",
    role: "parent" as RoleName,
  },
  {
    id: "3",
    email: "staff@example.com",
    password: "staffpass",
    role: "staff" as RoleName,
  },
  {
    id: "4",
    email: "doctor@example.com",
    password: "doctor123",
    role: "staff" as RoleName,
  },
  {
    id: "5",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as RoleName,
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with matching email and password
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In a real app, you would:
    // 1. Use a proper authentication library
    // 2. Hash passwords
    // 3. Generate a JWT token

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = user;

    // Return user data and a mock token
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
