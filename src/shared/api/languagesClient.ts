import { api } from "@/shared/api/client"
import type { Language } from "@/shared/types/api"

export async function listLanguages(): Promise<Language[]> {
  const { data } = await api.get<Language[]>("/languages")
  return data
}
