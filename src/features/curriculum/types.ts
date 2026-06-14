export type CollectionProgress = {
  total_tasks: number
  passed_tasks: number
  progress_percent: number
}

export type CollectionNextTask = {
  task_id: number
  title: string
  progress_status?: string | null
}

export type CollectionSummary = {
  collection_id: string
  title_ru: string
  description_ru: string
  route_path: string
  order: number
  progress: CollectionProgress
  completed: boolean
  button_label: string
  next_task: CollectionNextTask | null
}

export type LanguageTrack = {
  language: string
  language_label: string
  progress: CollectionProgress
  collections: CollectionSummary[]
}

export type ShowcaseTask = {
  task_id: number
  title: string
  action: string
  action_label: string
  action_skill_label: string
  action_description_ru: string
  difficulty: string
  progress_status?: string | null
  short_instruction: string
  subtopic_name_ru: string
}

export type ShowcaseSection = {
  id: string
  name_ru: string
  tasks: ShowcaseTask[]
  progress: CollectionProgress
}

export type CollectionShowcase = {
  collection_id: string
  title: string
  description: string
  total_tasks: number
  progress: CollectionProgress | null
  sections: ShowcaseSection[]
  next_task: CollectionNextTask | null
  button_label: string
  completed: boolean
}

export type CurriculumNavState = {
  returnTo: string
  navigationMode: "curriculum"
  collectionId: string
  collectionTitle?: string
}
