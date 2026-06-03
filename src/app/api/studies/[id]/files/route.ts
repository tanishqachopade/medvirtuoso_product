import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import fs from "fs";
import path from "path";

import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  context: any
) {
  try {

    const params =
      await context.params;

    const studyId =
      params.id;

    const formData =
      await request.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const extension =
      file.name
        .split(".")
        .pop();

    const savedFileName =
      `${uuidv4()}.${extension}`;

   const uploadDir =
  path.join(
    process.cwd(),
    "public",
    "uploads",
    studyId
  );

    if (
      !fs.existsSync(uploadDir)
    ) {
      fs.mkdirSync(
        uploadDir,
        {
          recursive: true,
        }
      );
    }

    const filePath =
      path.join(
        uploadDir,
        savedFileName
      );

    fs.writeFileSync(
      filePath,
      buffer
    );

    const fileUrl =
      `/uploads/${studyId}/${savedFileName}`;

    await prisma.studyFile.create({
      data: {
        studyId,

        fileName:
          file.name,

        fileUrl,

        fileType:
          file.type ||
          "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      fileUrl,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to upload file",
      },
      {
        status: 500,
      }
    );
  }
}