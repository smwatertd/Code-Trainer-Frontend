import { useQuery } from "@tanstack/react-query"
import { listTeacherTasks } from "@/shared/api/teacherTaskClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useTeacherTasks() {
  return useQuery({
    queryKey: queryKeys.teacherTasks(),
    queryFn: listTeacherTasks,
  })
}
