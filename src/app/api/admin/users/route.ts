import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import bcrypt from "bcryptjs";

export async function GET() {
  try {

    const users =
      await prisma.user.findMany({

        include: {
          institution: true,

          assignedOperator: true,
        },

        orderBy: {
          name: "asc",
        },
      });

    return NextResponse.json(
      users
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {

    const body =
      await request.json();

    const {
      name,
      email,
      password,
      role,
      institutionId,
    } = body;

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await prisma.user.create({
        data: {

          name,

          email,

          password:
            hashedPassword,

          role,

          institutionId,

        },
      });

    return NextResponse.json(
      user
    );

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}