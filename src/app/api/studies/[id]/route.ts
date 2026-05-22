import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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
      patientName,
      studyDescription,
      modality,
      imagingLink,
    } = body;

    // UPDATE STUDY
    const updatedStudy =
      await prisma.study.update({
        where: {
          id,
        },

        data: {
          studyDescription,
          modality,
          imagingLink,

          patient: {
            update: {
              patientName,
            },
          },
        },

        include: {
          patient: true,
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