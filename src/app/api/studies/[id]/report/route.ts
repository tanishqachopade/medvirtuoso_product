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
      formData.get(
        "file"
      ) as File;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // CREATE BUFFER
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // UNIQUE NAME
    const extension =
      file.name
        .split(".")
        .pop();

    const fileName =
      `${uuidv4()}.${extension}`;

    // SAVE PATH
    const uploadDir =
      path.join(
        process.cwd(),
        "public",
        "reports"
      );

    // CREATE FOLDER IF NOT EXISTS
    if (
      !fs.existsSync(
        uploadDir
      )
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
        fileName
      );

    // SAVE FILE
    fs.writeFileSync(
      filePath,
      buffer
    );

    // PUBLIC URL
    const reportUrl =
      `/reports/${fileName}`;

    // CHECK EXISTING REPORT
    const existingReport =
      await prisma.report.findUnique({
        where: {
          studyId,
        },
      });

    if (existingReport) {

      await prisma.report.update({
        where: {
          studyId,
        },

        data: {
          reportUrl,
        },
      });

    } else {

      await prisma.report.create({
        data: {
          studyId,

          reportUrl,
        },
      });

    }

    // UPDATE STUDY STATUS
    await prisma.study.update({
      where: {
        id: studyId,
      },

      data: {
        status: "READY",
      },
    });

    return NextResponse.json({
      success: true,
      reportUrl,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to upload report",
      },
      {
        status: 500,
      }
    );
  }
}