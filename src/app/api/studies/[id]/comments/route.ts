import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET COMMENTS
// =========================
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } =
      await params;

    const comments =
      await prisma.studyComment.findMany({
        where: {
          studyId: id,
        },

        include: {
          user: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return NextResponse.json(
      comments
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch comments",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// CREATE COMMENT
// =========================
export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { id } =
      await params;

    const body =
      await request.json();

    const { message } =
      body;

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Message required",
        },
        {
          status: 400,
        }
      );
    }

    // TEMP CLIENT USER
    const user =
      await prisma.user.findFirst({
        where: {
          role: "CLIENT",
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 500,
        }
      );
    }

    const comment =
      await prisma.studyComment.create({
        data: {
          studyId: id,

          userId: user.id,

          message,
        },

        include: {
          user: true,
        },
      });

    return NextResponse.json(
      comment
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create comment",
      },
      {
        status: 500,
      }
    );
  }
}