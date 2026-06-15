export function getVisiblePageNumbers(
  currentPage: number,
  pageCount: number,
  windowSize = 5,
): number[] {
  if (pageCount <= 0) return []
  if (pageCount <= windowSize) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, currentPage - half)
  let end = start + windowSize - 1

  if (end > pageCount) {
    end = pageCount
    start = end - windowSize + 1
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
