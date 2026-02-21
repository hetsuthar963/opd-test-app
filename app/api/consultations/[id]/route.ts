import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/consultations/[id] - Mark consultation as complete
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Also update the appointment status to COMPLETED
    await prisma.appointment.update({
      where: { id: consultation.appointmentId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error updating consultation:", error);
    return NextResponse.json(
      { error: "Failed to update consultation" },
      { status: 500 }
    );
  }
}
