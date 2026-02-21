import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consultationSchema } from "@/lib/validators";

// GET /api/consultations - List all consultations
export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        patient: true,
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        appointment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to include doctor name
    const transformed = consultations.map((c) => ({
      ...c,
      doctor: {
        id: c.doctor.id,
        name: c.doctor.user.name,
        specialization: c.doctor.specialization,
      },
    }));

    return NextResponse.json({ consultations: transformed });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}

// POST /api/consultations - Create a consultation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = consultationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { appointmentId, patientId, doctorId, bloodPressure, temperature, notes } =
      validation.data;

    // Check if consultation already exists
    const existing = await prisma.consultation.findUnique({
      where: { appointmentId },
    });

    let consultation;
    if (existing) {
      // Update existing
      consultation = await prisma.consultation.update({
        where: { id: existing.id },
        data: {
          bloodPressure,
          temperature,
          notes,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    } else {
      // Create new
      consultation = await prisma.consultation.create({
        data: {
          appointmentId,
          patientId,
          doctorId,
          bloodPressure,
          temperature,
          notes,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    // Update appointment status
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    );
  }
}
