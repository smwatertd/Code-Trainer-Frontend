import { useMemo, useState, useEffect, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  catalogStudentStatus,
  formatTaskLanguageLabels,
  matchesLanguageFilter,
  matchesStatusFilter,
} from "@/features/catalog/lib/taskCatalogView"
import { collectCatalogFilterOptions, collectConstructionOptions, type TaskSummaryWithConstructions } from "@/features/catalog/lib/taskCatalogFilters"
import CatalogStatusBadge from "@/features/catalog/ui/CatalogStatusBadge"
import DiffBadge from "@/features/catalog/ui/DiffBadge"
import TaskStatusDot from "@/features/catalog/ui/TaskStatusDot"
import Chip from "@/shared/ui/Chip"
import EmptyState from "@/shared/ui/EmptyState"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import type { TaskSummary } from "@/shared/types/api"
import { getConstructionLabel } from "@/features/task-solving/model/studentUiUtils"
import { labelDifficulty, labelTaskType, labelTopic } from "@/shared/utils/labels"
import { cn } from "@/shared/ui/cn"
import { getVisiblePageNumbers } from "@/shared/utils/pagination"
import { Button } from "@/shared/ui/button"
import { SlidersHorizontal } from "lucide-react"

type TaskCatalogProps = {
  tasks: TaskSummary[]
  filterSourceTasks?: TaskSummary[]
  isLoading: boolean
  error?: string | null
  taskLinkPrefix: string
  difficultyFilter?: string
  taskTypeFilter?: string
  topicFilter?: string
  langFrom?: string
  langTo?: string
  languageOptions?: string[]
  statusFilter?: string
  onDifficultyFilterChange?: (value: string) => void
  onTaskTypeFilterChange?: (value: string) => void
  onTopicFilterChange?: (value: string) => void
  onLangFromChange?: (value: string) => void
  onLangToChange?: (value: string) => void
  onStatusFilterChange?: (value: string) => void
  onSwapLangs?: () => void
  className?: string
}

const ALL = "__all__"
const PAGE_SIZE = 20

export default function TaskCatalog({
  tasks,
  filterSourceTasks,
  isLoading,
  error,
  taskLinkPrefix,
  difficultyFilter = ALL,
  taskTypeFilter = ALL,
  topicFilter = ALL,
  langFrom = ALL,
  langTo = ALL,
  languageOptions = [],
  statusFilter = ALL,
  onDifficultyFilterChange,
  onTaskTypeFilterChange,
  onTopicFilterChange,
  onLangFromChange,
  onLangToChange,
  onStatusFilterChange,
  onSwapLangs,
  className,
}: TaskCatalogProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [matchMode, setMatchMode] = useState<"all" | "any">("all")
  const [patternFilter, setPatternFilter] = useState(ALL)

  const optionTasks = filterSourceTasks ?? tasks
  const { difficulties, taskTypes, topics } = useMemo(
    () => collectCatalogFilterOptions(optionTasks),
    [optionTasks],
  )
  const constructions = useMemo(
    () => collectConstructionOptions(optionTasks as TaskSummaryWithConstructions[]),
    [optionTasks],
  )

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (q && !task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) {
        return false
      }
      if (!matchesLanguageFilter(task, langFrom, langTo, ALL)) return false

      const checks = [
        {
          active: statusFilter !== ALL,
          pass: matchesStatusFilter(task, statusFilter, ALL),
        },
        {
          active: patternFilter !== ALL,
          pass: (task as TaskSummaryWithConstructions).constructions?.includes(patternFilter) ?? false,
        },
      ]
      const active = checks.filter((check) => check.active)
      if (active.length > 0) {
        const matched =
          matchMode === "any" ? active.some((check) => check.pass) : active.every((check) => check.pass)
        if (!matched) return false
      }
      return true
    })
  }, [search, tasks, langFrom, langTo, statusFilter, patternFilter, matchMode])

  const pageCount = Math.max(1, Math.ceil(searched.length / PAGE_SIZE))
  const paged = searched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const visiblePages = useMemo(
    () => getVisiblePageNumbers(page, pageCount),
    [page, pageCount],
  )

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const filterCount =
    (difficultyFilter !== ALL ? 1 : 0) +
    (taskTypeFilter !== ALL ? 1 : 0) +
    (topicFilter !== ALL ? 1 : 0) +
    (statusFilter !== ALL ? 1 : 0) +
    (patternFilter !== ALL ? 1 : 0)

  const resetFilters = () => {
    onDifficultyFilterChange?.(ALL)
    onTaskTypeFilterChange?.(ALL)
    onTopicFilterChange?.(ALL)
    onLangFromChange?.(ALL)
    onLangToChange?.(ALL)
    onStatusFilterChange?.(ALL)
    setPatternFilter(ALL)
    setMatchMode("all")
    setSearch("")
    setPage(1)
  }

  if (isLoading) {
    return <p className="py-12 text-center text-ink-muted">Загрузка каталога…</p>
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить задачи" description={error} />
  }

  return (
    <div className={cn("w-full min-w-0", className)}>
      <div className="filter-toolbar mb-[18px] w-full rounded-lg border border-border bg-surface p-3.5 shadow-card">
        <div className="flex w-full flex-wrap items-center gap-2.5">
          <input
            className="h-[42px] min-w-[200px] flex-1 rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm font-medium text-ink outline-none transition focus:border-lime focus:ring-[3px] focus:ring-lime-soft"
            placeholder="Поиск задач…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
          <select
            className="h-[42px] w-[140px] shrink-0 rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm font-medium text-ink outline-none transition focus:border-lime focus:ring-[3px] focus:ring-lime-soft"
            value={langFrom}
            onChange={(event) => {
              onLangFromChange?.(event.target.value)
              setPage(1)
            }}
            title="Язык задачи"
            data-testid="filter-lang-from"
          >
            <option value={ALL}>Любой язык</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="swap-btn"
            onClick={() => {
              onSwapLangs?.()
              setPage(1)
            }}
            title="Поменять языки местами"
            data-testid="filter-lang-swap"
          >
            ⇄
          </button>
          <select
            className="h-[42px] w-[140px] shrink-0 rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm font-medium text-ink outline-none transition focus:border-lime focus:ring-[3px] focus:ring-lime-soft"
            value={langTo}
            onChange={(event) => {
              onLangToChange?.(event.target.value)
              setPage(1)
            }}
            title="Целевой язык (для Translation)"
            data-testid="filter-lang-to"
          >
            <option value={ALL}>Любой язык</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            className={cn(
              "h-[42px] gap-2",
              filterOpen && "bg-purple text-white shadow-[var(--glow-purple)]",
            )}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтр
            {filterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-bold text-white">
                {filterCount}
              </span>
            ) : null}
          </Button>
        </div>

        {filterOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[15] cursor-default bg-transparent"
              aria-label="Закрыть фильтры"
              onClick={() => setFilterOpen(false)}
            />
            <div className="filter-popover">
              <FilterRow label="Совпадение">
                <select
                  className="h-[42px] max-w-[340px] rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
                  value={matchMode}
                  onChange={(event) => setMatchMode(event.target.value as "all" | "any")}
                >
                  <option value="all">Все условия (AND)</option>
                  <option value="any">Любое из условий (OR)</option>
                </select>
              </FilterRow>

              <FilterRow label="Статус">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    onStatusFilterChange?.(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-[42px] max-w-[340px]" data-testid="filter-status">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Любой</SelectItem>
                    <SelectItem value="solved">Решено</SelectItem>
                    <SelectItem value="attempted">В процессе</SelectItem>
                    <SelectItem value="todo">Не начато</SelectItem>
                  </SelectContent>
                </Select>
              </FilterRow>

              <FilterRow label="Сложность" testId="filter-difficulty">
                <div className="flex flex-wrap gap-2">
                  <Chip
                    active={difficultyFilter === ALL}
                    onClick={() => {
                      onDifficultyFilterChange?.(ALL)
                      setPage(1)
                    }}
                  >
                    Все
                  </Chip>
                  {difficulties.map((value) => (
                    <Chip
                      key={value}
                      active={difficultyFilter === value}
                      data-testid={value === difficultyFilter ? "filter-difficulty" : undefined}
                      onClick={() => {
                        onDifficultyFilterChange?.(difficultyFilter === value ? ALL : value)
                        setPage(1)
                      }}
                    >
                      {labelDifficulty(value)}
                    </Chip>
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Типы" testId="filter-task-type">
                <div className="flex flex-wrap gap-2">
                  <Chip
                    active={taskTypeFilter === ALL}
                    onClick={() => {
                      onTaskTypeFilterChange?.(ALL)
                      setPage(1)
                    }}
                  >
                    Все
                  </Chip>
                  {taskTypes.map((value) => (
                    <Chip
                      key={value}
                      active={taskTypeFilter === value}
                      data-testid={value === taskTypeFilter ? "filter-task-type" : undefined}
                      onClick={() => {
                        onTaskTypeFilterChange?.(taskTypeFilter === value ? ALL : value)
                        setPage(1)
                      }}
                    >
                      {labelTaskType(value)}
                    </Chip>
                  ))}
                </div>
              </FilterRow>

              {topics.length > 0 ? (
                <FilterRow label="Тема">
                  <Select value={topicFilter} onValueChange={(value) => {
                    onTopicFilterChange?.(value)
                    setPage(1)
                  }}>
                    <SelectTrigger className="h-[42px] max-w-[340px]" data-testid="filter-topic">
                      <SelectValue placeholder="Выберите тему" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Все темы</SelectItem>
                      {topics
                        .sort((left, right) =>
                          labelTopic(left).localeCompare(labelTopic(right), "ru"),
                        )
                        .map((value) => (
                          <SelectItem key={value} value={value}>
                            {labelTopic(value)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FilterRow>
              ) : null}

              {constructions.length > 0 ? (
                <FilterRow label="Конструкции">
                  <select
                    className="h-[42px] max-w-[340px] rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
                    value={patternFilter}
                    onChange={(event) => {
                      setPatternFilter(event.target.value)
                      setPage(1)
                    }}
                  >
                    <option value={ALL}>Выберите конструкцию</option>
                    {constructions.map((value) => (
                      <option key={value} value={value}>
                        {getConstructionLabel(value)}
                      </option>
                    ))}
                  </select>
                </FilterRow>
              ) : null}

              <div className="mt-3.5 flex justify-end gap-2.5 border-t border-border pt-3.5">
                <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
                  Сбросить
                </Button>
                <Button type="button" size="sm" onClick={() => setFilterOpen(false)}>
                  Применить
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {searched.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте сбросить фильтры или изменить поиск."
        />
      ) : (
        <div className="w-full rounded-lg border border-border bg-surface p-5 shadow-card">
          <div className="overflow-x-auto">
            <table className="catalog-table w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint">
                  <th className="w-[38px] pb-3 pl-3.5 pr-3.5" />
                  <th className="pb-3 pr-3.5">Задача</th>
                  <th className="pb-3 pr-3.5">Тип</th>
                  <th className="pb-3 pr-3.5">Язык</th>
                  <th className="pb-3 pr-3.5">Сложность</th>
                  <th className="whitespace-nowrap pb-3 pr-3.5">Статус</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((task) => {
                  const status = catalogStudentStatus(task.progress_status)
                  return (
                    <tr
                      key={task.id}
                      className="cursor-pointer transition-colors hover:bg-surface-2"
                      onClick={() => navigate(`${taskLinkPrefix}/${task.id}`)}
                    >
                      <td className="border-t border-border py-3 pl-3.5 pr-3.5">
                        <TaskStatusDot status={status} />
                      </td>
                      <td className="t-name border-t border-border py-3 pr-3.5 font-semibold text-ink">
                        <Link
                          to={`${taskLinkPrefix}/${task.id}`}
                          className="hover:text-lime"
                          data-testid={`catalog-task-${task.id}`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className="border-t border-border py-3 pr-3.5 text-ink-muted">
                        {labelTaskType(task.task_type)}
                      </td>
                      <td className="border-t border-border py-3 pr-3.5 text-ink-muted">
                        {formatTaskLanguageLabels(task.languages)}
                      </td>
                      <td className="border-t border-border py-3 pr-3.5">
                        <DiffBadge difficulty={task.difficulty} />
                      </td>
                      <td className="whitespace-nowrap border-t border-border py-3 pr-3.5">
                        <CatalogStatusBadge status={status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-between text-sm text-ink-faint">
              <span>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, searched.length)} из{" "}
                {searched.length}
              </span>
              <div className="flex gap-1.5">
                <PaginationButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  ‹
                </PaginationButton>
                {visiblePages.map((pageNumber) => (
                  <PaginationButton
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationButton>
                ))}
                <PaginationButton
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </PaginationButton>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function FilterRow({
  label,
  children,
  testId,
}: {
  label: string
  children: ReactNode
  testId?: string
}) {
  return (
    <div className="filter-row" data-testid={testId}>
      <label>{label}</label>
      <div>{children}</div>
    </div>
  )
}

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-[9px] border border-[#333d4f] px-2.5 text-[13.5px] font-semibold text-ink-muted transition",
        active && "border-lime bg-lime text-bg",
        !active && !disabled && "hover:border-lime hover:text-ink",
        disabled && "cursor-not-allowed opacity-35",
      )}
    >
      {children}
    </button>
  )
}

export { ALL as TASK_CATALOG_FILTER_ALL }
