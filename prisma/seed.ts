import {
  PrismaClient,
  UserRole,
} from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // HASH PASSWORD
  const hashedPassword =
    await bcrypt.hash(
      "password123",
      10
    );

  // CREATE INSTITUTION
  const institution =
    await prisma.institution.create({
      data: {
        name:
          "MedMarvel Hospital",
      },
    });

  // CREATE SITE
  const site =
    await prisma.site.create({
      data: {
        name: "Main Site",

        institutionId:
          institution.id,
      },
    });

  // CREATE CLIENT USER
  await prisma.user.create({
    data: {
      name: "Client User",

      email:
        "client@medvirtuoso.com",

      password:
        hashedPassword,

      role: UserRole.CLIENT,

      institutionId:
        institution.id,
    },
  });

  // CREATE OPERATOR USER
  await prisma.user.create({
    data: {
      name: "Operator User",

      email:
        "operator@medvirtuoso.com",

      password:
        hashedPassword,

      role:
        UserRole.OPERATOR,

      institutionId:
        institution.id,
    },
  });

  console.log(
    "Database seeded successfully"
  );
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });