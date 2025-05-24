import { NextResponse } from "next/server";
import { Child } from "@/lib/models";

// Mock data for children
export const children: Child[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    dob: "2016-05-12",
    gender: "male",
    grade: "3",
    class: "3A",
    parentId: "1",
    healthRecordId: "hr1",
  },
  {
    id: "2",
    name: "Nguyễn Thị Lan",
    dob: "2018-03-15",
    gender: "female",
    grade: "1",
    class: "1B",
    parentId: "1",
    healthRecordId: "hr2",
  },
  {
    id: "3",
    name: "Trần Minh Hoàng",
    dob: "2017-10-23",
    gender: "male",
    grade: "2",
    class: "2A",
    parentId: "2",
    healthRecordId: "hr3",
  },
];

export async function GET(request: Request) {
  // Parse the URL to get query parameters
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");

  try {
    if (parentId) {
      // If parentId is provided, filter children by parent
      const filteredChildren = children.filter(
        (child) => child.parentId === parentId
      );

      if (filteredChildren.length === 0) {
        return NextResponse.json(
          { message: "No children found for this parent" },
          { status: 404 }
        );
      }

      return NextResponse.json(filteredChildren);
    } else {
      // Return all children if no parentId is provided
      return NextResponse.json(children);
    }
  } catch (error) {
    console.error("Error retrieving children:", error);
    return NextResponse.json(
      { error: "Failed to retrieve children" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const childData = await request.json();

    // Validate required fields
    if (
      !childData.name ||
      !childData.dob ||
      !childData.gender ||
      !childData.grade ||
      !childData.class ||
      !childData.parentId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new child with an ID
    const newChild: Child = {
      id: `${children.length + 1}`,
      ...childData,
    };

    // Add to the mock database
    children.push(newChild);

    return NextResponse.json(newChild, { status: 201 });
  } catch (error) {
    console.error("Error adding child:", error);
    return NextResponse.json({ error: "Failed to add child" }, { status: 500 });
  }
}
