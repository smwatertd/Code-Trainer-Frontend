import {
  canSwapParallelLanguages,
  langDisplay,
} from "@/features/task-solving/model/studentUiUtils"
import { cn } from "@/shared/ui/cn"

type ParallelLanguageBarProps = {
  knownLanguage: string
  learningLanguage: string
  knownLanguages: string[]
  learningLanguages: string[]
  onKnownLanguageChange: (language: string) => void
  onLearningLanguageChange: (language: string) => void
  onSwap?: () => void
}

const selectClassName =
  "h-[34px] min-w-[140px] rounded-md border border-[#333d4f] bg-bg-2 px-2.5 text-sm text-ink outline-none transition focus:border-lime/50 focus:ring-2 focus:ring-lime/20"

export default function ParallelLanguageBar({
  knownLanguage,
  learningLanguage,
  knownLanguages,
  learningLanguages,
  onKnownLanguageChange,
  onLearningLanguageChange,
  onSwap,
}: ParallelLanguageBarProps) {
  const swapEnabled = canSwapParallelLanguages(
    knownLanguage,
    learningLanguage,
    knownLanguages,
    learningLanguages,
  )

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-[#0c111a] px-4 py-2.5">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        Я знаю
      </span>
      <select
        value={knownLanguage}
        onChange={(event) => onKnownLanguageChange(event.target.value)}
        className={selectClassName}
        data-testid="known-language-select"
        aria-label="Я знаю"
      >
        {knownLanguages.map((lang) => (
          <option key={lang} value={lang} disabled={lang === learningLanguage}>
            {langDisplay(lang)}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={cn("swap-btn", !swapEnabled && "swap-btn-disabled")}
        disabled={!swapEnabled}
        onClick={onSwap}
        data-testid="language-swap-btn"
        title={
          swapEnabled
            ? "Поменять языки местами"
            : "Нельзя поменять: языки совпадают или доступен только один вариант"
        }
      >
        ⇄
      </button>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        Учу
      </span>
      <select
        value={learningLanguage}
        onChange={(event) => onLearningLanguageChange(event.target.value)}
        className={selectClassName}
        data-testid="learning-language-select"
        aria-label="Учу"
      >
        {learningLanguages.map((lang) => (
          <option key={lang} value={lang} disabled={lang === knownLanguage}>
            {langDisplay(lang)}
          </option>
        ))}
      </select>
    </div>
  )
}
