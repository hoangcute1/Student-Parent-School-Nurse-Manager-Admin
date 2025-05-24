import { NextResponse } from "next/server";
import { RoleName, isValidRole } from "@/lib/roles";

// Mock data - trong thực tế bạn sẽ kết nối với database
export const users = [
  {
    id: "1",
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    role: "parent" as RoleName,
    password: "password123",
  },
  {
    id: "2",
    name: "Tran Thi B",
    email: "tranthib@example.com",
    role: "parent" as RoleName,
    password: "password123",
  },
  {
    id: "3",
    name: "Le Van C",
    email: "staff@example.com",
    role: "staff" as RoleName,
    password: "staffpass",
  },
  {
    id: "4",
    name: "Bac Si D",
    email: "doctor@example.com",
    role: "staff" as RoleName,
    password: "doctor123",
  },
  {
    id: "5",
    name: "Admin",
    email: "admin@example.com",
    role: "admin" as RoleName,
    password: "admin123",
  },
];

export async function GET() {
  // Return users without passwords
  const safeUsers = users.map(({ password, ...user }) => user);
  return NextResponse.json(safeUsers);
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !isValidRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      role: role || ("parent" as RoleName), // Default to parent role
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}
