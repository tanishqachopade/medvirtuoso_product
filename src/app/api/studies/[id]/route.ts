import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const study =
      await prisma.study.findUnique({
        where: {
          id,
        },

        include: {
          patient: true,
          report: true,
          files: true,
        },
      });

    if (!study) {
      return NextResponse.json(
        { error: "Study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(study);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch study",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } =
      await params;

    // DELETE COMMENTS
    await prisma.studyComment.deleteMany({
      where: {
        studyId: id,
      },
    });

    // DELETE FILES
    await prisma.studyFile.deleteMany({
      where: {
        studyId: id,
      },
    });

    // DELETE REPORT
    await prisma.report.deleteMany({
      where: {
        studyId: id,
      },
    });

    // DELETE STUDY
    await prisma.study.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to delete study",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {

    const { id } =
      await params;

    const body =
      await request.json();

    const {
      status,
      patientName,
      patientId,
      studyDescription,
      modality,
      imagingLink,
    } = body;

    // GET EXISTING STUDY
    const existingStudy =
      await prisma.study.findUnique({
        where: { id },

        include: {
          patient: true,
        },
      });

    if (!existingStudy) {

      return NextResponse.json(
        {
          error:
            "Study not found",
        },
        {
          status: 404,
        }
      );
    }

    // UPDATE STUDY
    const updatedStudy =
      await prisma.study.update({

        where: {
          id,
        },

        data: {

          ...(status && {
            status,
          }),

          ...(studyDescription !==
            undefined && {
            studyDescription,
          }),

          ...(modality !==
            undefined && {
            modality,
          }),

          ...(imagingLink !==
            undefined && {
            imagingLink,
          }),

          // UPDATE OR CREATE PATIENT
patient: existingStudy.patient
  ? {
      update: {
        patientName:
          patientName || "-",

        patientId:
          patientId || "-",
      },
    }
  : {
      create: {
        patientName:
          patientName || "-",

        patientId:
          patientId || "-",
      },
    },

        },

        include: {
          patient: true,
          report: true,
        },

      });

    return NextResponse.json(
      updatedStudy
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to update study",
      },
      {
        status: 500,
      }
    );
  }
}

