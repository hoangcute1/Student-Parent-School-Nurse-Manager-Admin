import { NextResponse } from "next/server";
import { healthRecords } from "../../../route";

// Update a specific vaccination record
export async function PUT(
  request: Request,
  { params }: { params: { childId: string; vaccinationId: string } }
) {
  try {
    const { childId, vaccinationId } = params;
    const vaccinationData = await request.json();

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

    // Find the vaccination record
    const vaccinationIndex = healthRecords[recordIndex].vaccinations.findIndex(
      (vaccination) => vaccination.id === vaccinationId
    );
    if (vaccinationIndex === -1) {
      return NextResponse.json(
        { error: "Vaccination record not found" },
        { status: 404 }
      );
    }

    // Update the vaccination record
    healthRecords[recordIndex].vaccinations[vaccinationIndex] = {
      ...healthRecords[recordIndex].vaccinations[vaccinationIndex],
      ...vaccinationData,
    };

    // Update the lastUpdated field
    healthRecords[recordIndex].lastUpdated = new Date().toISOString();

    return NextResponse.json(healthRecords[recordIndex]);
  } catch (error) {
    console.error("Error updating vaccination:", error);
    return NextResponse.json(
      { error: "Failed to update vaccination" },
      { status: 500 }
    );
  }
}

// Delete a specific vaccination record
export async function DELETE(
  request: Request,
  { params }: { params: { childId: string; vaccinationId: string } }
) {
  try {
    const { childId, vaccinationId } = params;

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

    // Find the vaccination record
    const vaccinationIndex = healthRecords[recordIndex].vaccinations.findIndex(
      (vaccination) => vaccination.id === vaccinationId
    );
    if (vaccinationIndex === -1) {
      return NextResponse.json(
        { error: "Vaccination record not found" },
        { status: 404 }
      );
    }

    // Remove the vaccination record
    healthRecords[recordIndex].vaccinations.splice(vaccinationIndex, 1);

    // Update the lastUpdated field
    healthRecords[recordIndex].lastUpdated = new Date().toISOString();

    return NextResponse.json({
      message: "Vaccination record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    return NextResponse.json(
      { error: "Failed to delete vaccination" },
      { status: 500 }
    );
  }
}
