import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { comparePasswords } from "@/lib/hash";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log("LOGIN EMAIL:", email);
      console.log("USER FOUND:", !!user);
      console.log("USER ROLE:", user?.role);
      console.log("HASH:", user?.password);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const passwordValid =
      await comparePasswords(
        password,
        user.password
      );
    console.log("PASSWORD VALID:", passwordValid);
    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const token =
      await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    const response =
      NextResponse.json({
        message: "Login successful",
        role: user.role,
      });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}