import { canSwapParallelLanguages, langDisplay } from "@/features/task-solving/model/studentUiUtils"
import SimpleSelect from "@/shared/ui/SimpleSelect"

type ParallelLanguageBarProps = {
  knownLanguage: string
  learningLanguage: string
  knownLanguages: string[]
  learningLanguages: string[]
  onKnownLanguageChange: (language: string) => void
  onLearningLanguageChange: (language: string) => void
  onSwap?: () => void
}

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
      <SimpleSelect
        value={knownLanguage}
        onValueChange={onKnownLanguageChange}
        className="h-[34px] w-[140px] border-[#333d4f] bg-bg-2"
        options={knownLanguages.map((lang) => ({
          value: lang,
          label: langDisplay(lang),
          disabled: lang === learningLanguage,
        }))}
      />
      <button
        type="button"
        className="swap-btn"
        disabled={!swapEnabled}
        onClick={onSwap}
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
      <SimpleSelect
        value={learningLanguage}
        onValueChange={onLearningLanguageChange}
        className="h-[34px] w-[140px] border-[#333d4f] bg-bg-2"
        options={learningLanguages.map((lang) => ({
          value: lang,
          label: langDisplay(lang),
          disabled: lang === knownLanguage,
        }))}
      />
    </div>
  )
}
