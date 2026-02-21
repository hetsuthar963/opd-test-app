import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/doctors - List all doctors
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const availableOnly = searchParams.get("available") === "true";

    const where = availableOnly ? { isAvailable: true } : {};

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform to include user name
    const transformed = doctors.map((doc) => ({
      id: doc.id,
      name: doc.user.name,
      specialization: doc.specialization,
      registrationNo: doc.registrationNo,
      isAvailable: doc.isAvailable,
    }));

    return NextResponse.json({ data: transformed });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
