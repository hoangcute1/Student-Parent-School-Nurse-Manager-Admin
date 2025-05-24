import { NextResponse } from "next/server";
import { getAllRoles, getRoleByName } from "@/lib/roles";

// GET handler - get all roles
export async function GET() {
  try {
    const roles = getAllRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// POST handler - check if a role exists (used for validation)
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }
    
    const role = getRoleByName(name);
    
    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error validating role:", error);
    return NextResponse.json(
      { error: "Failed to validate role" },
      { status: 500 }
    );
  }
}