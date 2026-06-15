export type ConstructionExample = {
  title: string
  code: string
}

export type ConstructionDetail = {
  title: string
  description: string
  examples: Partial<Record<string, ConstructionExample[]>>
}
