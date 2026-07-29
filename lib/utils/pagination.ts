export function getPagination(page = 1, perPage = 10) {
  return { page, perPage, offset: (page - 1) * perPage };
}
