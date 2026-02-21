import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validators";

// GET /api/appointments - List appointments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    const where = date
      ? {
          appointmentDate: new Date(date),
        }
      : {};

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        consultation: true,
      },
      orderBy: [
        { appointmentDate: "asc" },
        { tokenNumber: "asc" },
      ],
    });

    // Transform to include doctor name
    const transformed = appointments.map((appt) => ({
      ...appt,
      doctor: {
        id: appt.doctor.id,
        name: appt.doctor.user.name,
        specialization: appt.doctor.specialization,
      },
    }));

    return NextResponse.json({ appointments: transformed });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Book an appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = appointmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { patientId, doctorId, appointmentDate, appointmentTime, reason } =
      validation.data;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 400 }
      );
    }

    // Get the latest token number for this date and doctor
    const latestAppt = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
      },
      orderBy: { tokenNumber: "desc" },
    });

    const tokenNumber = (latestAppt?.tokenNumber || 0) + 1;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        tokenNumber,
        reason,
        status: "SCHEDULED",
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
