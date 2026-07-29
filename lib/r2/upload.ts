import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

import { storageBuckets } from "@/lib/constants/storage";
import { createR2Client } from "@/lib/r2/client";
import { getUploadPath } from "@/lib/utils/upload-path";

type UploadToR2Options = {
  file: File;
  folder?: string;
  bucket?: string;
  publicUrl?: string;
};

type UploadToR2Result = {
  key: string;
  url: string;
  fileName: string;
};

function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getFileExtension(file: File) {
  const match = file.name.match(/\.[a-z0-9]+$/i);

  if (match) {
    return match[0].toLowerCase();
  }

  const mimeExtensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
  };

  return mimeExtensions[file.type] ?? "";
}

export async function uploadToR2({
  file,
  folder = storageBuckets.animeImages,
  bucket = getRequiredEnv("R2_BUCKET_NAME", process.env.R2_BUCKET_NAME),
  publicUrl = getRequiredEnv("R2_PUBLIC_URL", process.env.R2_PUBLIC_URL),
}: UploadToR2Options): Promise<UploadToR2Result> {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Archivo inválido para subir a R2.");
  }

  const client = createR2Client();
  const extension = getFileExtension(file);
  const fileName = `${nanoid(16)}${extension}`;
  const key = getUploadPath(fileName, folder);
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return {
    key,
    url: `${publicUrl.replace(/\/$/, "")}/${key}`,
    fileName,
  };
}
