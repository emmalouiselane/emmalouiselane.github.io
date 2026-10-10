export const BLOG_PAGE_SIZE = 6;
export const READING_PAGE_SIZE = 6;
export const WATCHING_PAGE_SIZE = 9;

export function pageUrl(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}page/${page}/`;
}

export function additionalPages(itemCount: number, pageSize: number) {
  return Array.from({ length: Math.max(0, Math.ceil(itemCount / pageSize) - 1) }, (_, index) => index + 2);
}
