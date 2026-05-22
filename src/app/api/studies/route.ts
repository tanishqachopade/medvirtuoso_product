import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";


// =========================
// CREATE STUDY
// =========================
export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      patientId,
      patientName,
      studyDescription,
      modality,
      imagingLink,
    } = body;

    // VALIDATION
    if (
      !patientId ||
      !patientName ||
      !studyDescription ||
      !modality
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // FIND REAL SITE
    const site =
      await prisma.site.findFirst();

    // FIND REAL CLIENT USER
    const user =
      await prisma.user.findFirst({
        where: {
          role: "CLIENT",
        },
      });

    if (!site || !user) {
      return NextResponse.json(
        {
          error:
            "Missing site or user",
        },
        {
          status: 500,
        }
      );
    }

    // CREATE PATIENT
    const patient =
      await prisma.patient.create({
        data: {
          patientId,
          patientName,
        },
      });

    // CREATE STUDY
    const study =
      await prisma.study.create({
        data: {
          studyDescription,

          modality,

          imagingLink,

          patientId:
            patient.id,

          siteId: site.id,

          userId: user.id,
        },

        include: {
          patient: true,
        },
      });

    return NextResponse.json({
      success: true,
      study,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create study",
      },
      {
        status: 500,
      }
    );
  }
}


// =========================
// FETCH STUDIES
// =========================
export async function GET() {
  try {
    const studies =
      await prisma.study.findMany({
        include: {
          patient: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      studies
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch studies",
      },
      {
        status: 500,
      }
    );
  }
}