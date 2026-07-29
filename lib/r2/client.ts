import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createR2Client() {
  if (client) {
    return client;
  }

  client = new S3Client({
    region: "auto",
    endpoint: getRequiredEnv("R2_ENDPOINT", process.env.R2_ENDPOINT),
    credentials: {
      accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID", process.env.R2_ACCESS_KEY_ID),
      secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY", process.env.R2_SECRET_ACCESS_KEY),
    },
    forcePathStyle: true,
  });

  return client;
}
