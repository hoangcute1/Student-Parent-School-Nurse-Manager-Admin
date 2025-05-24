import { NextResponse } from "next/server";

import { VaccinationRecord } from "@/lib/models";
import { healthRecords } from "../../route";

// Implement handler for dynamically segmented routes for vaccinations
export async function GET(
  request: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const childId = params.childId;

    // Find the health record for the child
    const healthRecord = healthRecords.find(
      (record) => record.childId === childId
    );
    if (!healthRecord) {
      return NextResponse.json(
        { error: "Health record not found for this child" },
        { status: 404 }
      );
    }

    // Return the vaccinations
    return NextResponse.json(healthRecord.vaccinations);
  } catch (error) {
    console.error("Error retrieving vaccinations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve vaccinations" },
      { status: 500 }
    );
  }
}

// Add a new vaccination record
export async function POST(
  request: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const childId = params.childId;
    const vaccinationData = await request.json();

    // Validate required fields
    if (
      !vaccinationData.vaccine ||
      !vaccinationData.date ||
      !vaccinationData.location
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the health record for the child
    const recordIndex = healthRecords.findIndex(
      (record) => record.childId === childId
    );
    if (recordIndex === -1) {
      return NextResponse.json(
        { error: "Health record not found for this child" },
        { status: 404 }
      );
    }

    // Create a new vaccination record
    const newVaccination: VaccinationRecord = {
      id: `vac${healthRecords[recordIndex].vaccinations.length + 1}`,
      ...vaccinationData,
    };

    // Add to the vaccinations array
    healthRecords[recordIndex].vaccinations.push(newVaccination);

    // Update the lastUpdated field
    healthRecords[recordIndex].lastUpdated = new Date().toISOString();

    return NextResponse.json(healthRecords[recordIndex], { status: 201 });
  } catch (error) {
    console.error("Error adding vaccination:", error);
    return NextResponse.json(
      { error: "Failed to add vaccination" },
      { status: 500 }
    );
  }
}
