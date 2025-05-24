import { NextResponse } from "next/server";
import { HealthRecord, VaccinationRecord } from "@/lib/models";
import { children } from "../children/route";

// Mock data for health records
export const healthRecords: HealthRecord[] = [
  {
    id: "hr1",
    childId: "1",
    basicInfo: {
      height: 125,
      weight: 25.5,
      bloodType: "A",
      rhFactor: "positive",
      vision: "normal",
      hearing: "normal",
    },
    medicalHistory: {
      chronicDiseases: [],
      chronicDetails: "",
      medications: "",
    },
    allergies: {
      food: ["nuts"],
      medications: [],
      other: ["dust"],
      details: "Nhẹ đến trung bình với các loại hạt và bụi",
      emergencyMedication: "Cetirizine nếu cần",
    },
    vaccinations: [
      {
        id: "vac1",
        vaccine: "BCG",
        date: "2016-06-15",
        location: "Bệnh viện Nhi Đồng",
        administered: true,
      },
      {
        id: "vac2",
        vaccine: "MMR",
        date: "2017-05-20",
        location: "Trung tâm Y tế Quận 1",
        administered: true,
      },
    ],
    lastUpdated: "2025-05-02T08:30:00Z",
    updatedBy: "staff1",
  },
  {
    id: "hr2",
    childId: "2",
    basicInfo: {
      height: 110,
      weight: 19.8,
      bloodType: "O",
      rhFactor: "negative",
      vision: "normal",
      hearing: "normal",
    },
    medicalHistory: {
      chronicDiseases: ["asthma"],
      chronicDetails: "Hen suyễn nhẹ, cần thuốc xịt khi vận động mạnh",
      medications: "Ventolin khi cần",
    },
    allergies: {
      food: [],
      medications: [],
      other: ["pollen"],
      details: "Dị ứng phấn hoa mùa xuân",
      emergencyMedication: "",
    },
    vaccinations: [
      {
        id: "vac3",
        vaccine: "BCG",
        date: "2018-04-10",
        location: "Bệnh viện Nhi Đồng",
        administered: true,
      },
      {
        id: "vac4",
        vaccine: "MMR",
        date: "2019-07-15",
        location: "Trung tâm Y tế Quận 1",
        administered: true,
      },
      {
        id: "vac5",
        vaccine: "Cúm mùa",
        date: "2025-11-15",
        location: "Trường Tiểu học Nguyễn Bỉnh Khiêm",
        administered: false,
      },
    ],
    lastUpdated: "2025-05-04T14:15:00Z",
    updatedBy: "staff2",
  },
  {
    id: "hr3",
    childId: "3",
    basicInfo: {
      height: 118,
      weight: 22.3,
      bloodType: "B",
      rhFactor: "positive",
      vision: "myopia",
      hearing: "normal",
    },
    medicalHistory: {
      chronicDiseases: [],
      chronicDetails: "",
      medications: "",
    },
    allergies: {
      food: ["seafood"],
      medications: ["penicillin"],
      other: [],
      details: "Dị ứng hải sản và penicillin nghiêm trọng",
      emergencyMedication: "EpiPen trong trường hợp khẩn cấp",
    },
    vaccinations: [
      {
        id: "vac6",
        vaccine: "BCG",
        date: "2017-11-12",
        location: "Bệnh viện Nhi Đồng",
        administered: true,
      },
      {
        id: "vac7",
        vaccine: "Viêm gan B",
        date: "2018-02-18",
        location: "Trung tâm Y tế Quận 3",
        administered: true,
      },
    ],
    lastUpdated: "2025-05-01T10:45:00Z",
    updatedBy: "staff1",
  },
];

// GET: Retrieve health records (all or by childId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  const recordId = searchParams.get("id");

  try {
    // Return a specific record by ID
    if (recordId) {
      const record = healthRecords.find((record) => record.id === recordId);
      if (!record) {
        return NextResponse.json(
          { message: "Health record not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(record);
    }

    // Return records for a specific child
    if (childId) {
      const record = healthRecords.find((record) => record.childId === childId);
      if (!record) {
        return NextResponse.json(
          { message: "No health record found for this child" },
          { status: 404 }
        );
      }
      return NextResponse.json(record);
    }

    // Return all health records
    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error("Error retrieving health records:", error);
    return NextResponse.json(
      { error: "Failed to retrieve health records" },
      { status: 500 }
    );
  }
}

// POST: Create a new health record
export async function POST(request: Request) {
  try {
    const recordData = await request.json();

    // Validate required fields
    if (!recordData.childId || !recordData.basicInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the child exists
    const childExists = children.some(
      (child) => child.id === recordData.childId
    );
    if (!childExists) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Check if a record already exists for this child
    const existingRecord = healthRecords.find(
      (record) => record.childId === recordData.childId
    );
    if (existingRecord) {
      return NextResponse.json(
        { error: "Health record already exists for this child" },
        { status: 409 }
      );
    }

    // Create new health record with an ID and current timestamp
    const newRecord: HealthRecord = {
      id: `hr${healthRecords.length + 1}`,
      ...recordData,
      lastUpdated: new Date().toISOString(),
      vaccinations: recordData.vaccinations || [],
    };

    // Add to the mock database
    healthRecords.push(newRecord);

    // Update the child with the health record ID
    const childIndex = children.findIndex(
      (child) => child.id === recordData.childId
    );
    if (childIndex !== -1) {
      children[childIndex].healthRecordId = newRecord.id;
    }

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json(
      { error: "Failed to create health record" },
      { status: 500 }
    );
  }
}

// Implement handler for dynamically segmented routes
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = params.id;
    const recordData = await request.json();

    // Find the record to update
    const recordIndex = healthRecords.findIndex(
      (record) => record.id === recordId
    );
    if (recordIndex === -1) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    // Update the record
    const updatedRecord = {
      ...healthRecords[recordIndex],
      ...recordData,
      lastUpdated: new Date().toISOString(),
    };

    healthRecords[recordIndex] = updatedRecord;

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating health record:", error);
    return NextResponse.json(
      { error: "Failed to update health record" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a health record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = params.id;

    // Find the record to delete
    const recordIndex = healthRecords.findIndex(
      (record) => record.id === recordId
    );
    if (recordIndex === -1) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    // Get the child ID from the record
    const childId = healthRecords[recordIndex].childId;

    // Remove the health record ID from the child
    const childIndex = children.findIndex((child) => child.id === childId);
    if (childIndex !== -1) {
      children[childIndex].healthRecordId = undefined;
    }

    // Remove the record from the array
    healthRecords.splice(recordIndex, 1);

    return NextResponse.json({ message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json(
      { error: "Failed to delete health record" },
      { status: 500 }
    );
  }
}
