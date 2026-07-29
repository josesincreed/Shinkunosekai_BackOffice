import slugify from "slugify";

export function slugifyText(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}
