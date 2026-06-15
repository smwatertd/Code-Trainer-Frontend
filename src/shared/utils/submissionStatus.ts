export type CatalogSubmissionStatus = "solved" | "attempted" | "todo"

export function mapSubmissionStatus(status: string): CatalogSubmissionStatus {
  if (status === "accepted") return "solved"
  if (status === "failed") return "attempted"
  return "todo"
}

export function filterProfileSubmissions<T extends { task_title: string; status: string }>(
  rows: T[],
  search: string,
  statusFilter: "all" | "solved" | "attempted",
): T[] {
  let filtered = rows.filter(
    (row) => !search || row.task_title.toLowerCase().includes(search.toLowerCase()),
  )
  if (statusFilter === "solved") {
    filtered = filtered.filter((row) => row.status === "accepted")
  } else if (statusFilter === "attempted") {
    filtered = filtered.filter((row) => row.status === "failed")
  }
  return filtered
}
