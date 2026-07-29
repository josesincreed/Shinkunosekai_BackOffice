export function getUploadPath(filename: string, folder = "uploads") {
  return `${folder}/${filename}`;
}
