import { uploadToR2 } from "@/lib/r2/upload";

export type UploadFileOptions = {
  file: File;
  folder?: string;
};

export async function uploadFile({ file, folder }: UploadFileOptions) {
  return uploadToR2({ file, folder });
}
