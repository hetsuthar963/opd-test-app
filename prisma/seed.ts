// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@opd.com" },
    update: {},
    create: {
      email: "admin@opd.com",
      name: "Admin User",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  // Doctor user
  const doctorHash = await bcrypt.hash("doctor123", 12);
  const doctorUser = await prisma.user.upsert({
    where: { email: "dr.sharma@opd.com" },
    update: {},
    create: {
      email: "dr.sharma@opd.com",
      name: "Dr. Rajesh Sharma",
      passwordHash: doctorHash,
      role: Role.DOCTOR,
    },
  });

  // Doctor profile
  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      name: "Dr. Rajesh Sharma",
      specialization: "General Physician",
      registrationNo: "MCI-2024-001",
    },
  });

  const doctorUser2Hash = await bcrypt.hash("doctor123", 12);
  const doctorUser2 = await prisma.user.upsert({
    where: { email: "dr.patel@opd.com" },
    update: {},
    create: {
      email: "dr.patel@opd.com",
      name: "Dr. Priya Patel",
      passwordHash: doctorUser2Hash,
      role: Role.DOCTOR,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: doctorUser2.id },
    update: {},
    create: {
      userId: doctorUser2.id,
      name: "Dr. Priya Patel",
      specialization: "Pediatrician",
      registrationNo: "MCI-2024-002",
    },
  });

  // Receptionist
  const recepHash = await bcrypt.hash("recep123", 12);
  await prisma.user.upsert({
    where: { email: "reception@opd.com" },
    update: {},
    create: {
      email: "reception@opd.com",
      name: "Anjali Mehta",
      passwordHash: recepHash,
      role: Role.RECEPTIONIST,
    },
  });

  console.log("✅ Seeded users:");
  console.log("   admin@opd.com       / admin123  (ADMIN)");
  console.log("   dr.sharma@opd.com   / doctor123 (DOCTOR)");
  console.log("   dr.patel@opd.com    / doctor123 (DOCTOR)");
  console.log("   reception@opd.com   / recep123  (RECEPTIONIST)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });