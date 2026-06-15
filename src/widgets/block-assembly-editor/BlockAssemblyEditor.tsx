import type { BlockPlacement } from "@/domain/blockAssembly/types"
import { isAssemblyComplete } from "@/domain/blockAssembly"
import { isTemplateAssemblyMode } from "@/widgets/block-assembly-editor/lib/blockAssemblyMode"
import FreeBlockAssemblyView from "@/widgets/block-assembly-editor/FreeBlockAssemblyView"
import TemplateBlockAssemblyView from "@/widgets/block-assembly-editor/TemplateBlockAssemblyView"

type BlockAssemblyEditorProps = {
  blocks?: string[]
  baseCode?: string
  code?: string
  rawTemplate?: string | null
  correctOrder?: number[]
  placements: BlockPlacement[]
  onChange: (payload: { placements: BlockPlacement[] }) => void
  language?: string
  primaryLanguage?: string
  languageVariants?: Record<string, unknown>
  onLanguageChange?: (language: string) => void
  shuffleKey?: string
  hideLanguageSelect?: boolean
}

export default function BlockAssemblyEditor({
  blocks = [],
  baseCode: baseCodeProp,
  code: codeProp,
  rawTemplate,
  correctOrder,
  placements,
  onChange,
  language,
  primaryLanguage,
  languageVariants,
  onLanguageChange,
  shuffleKey = "",
  hideLanguageSelect = false,
}: BlockAssemblyEditorProps) {
  const baseCode = baseCodeProp ?? codeProp ?? ""
  const isTemplate = isTemplateAssemblyMode(baseCode, rawTemplate)

  const availableLanguages = (() => {
    const langs: string[] = []
    if (primaryLanguage) langs.push(primaryLanguage)
    if (language && !langs.includes(language)) langs.push(language)
    if (languageVariants) {
      Object.keys(languageVariants).forEach((lang) => {
        if (!langs.includes(lang)) langs.push(lang)
      })
    }
    return langs
  })()

  const isLanguageAvailable = (lang: string) => {
    if (lang === primaryLanguage) return true
    if (lang === language) return true
    return Boolean(languageVariants && languageVariants[lang])
  }

  return (
    <div className="flex h-full min-h-[460px] flex-col bg-bg-2" data-testid="block-assembly-editor">
      {!hideLanguageSelect && availableLanguages.length > 1 ? (
        <div className="shrink-0 border-b border-border px-4 py-2">
          <select
            value={language || primaryLanguage || availableLanguages[0] || ""}
            onChange={(event) => onLanguageChange?.(event.target.value)}
            className="rounded-md border border-[#333d4f] bg-surface-2 px-2 py-1 font-mono text-[12.5px] text-ink focus:outline-none focus:ring-1 focus:ring-lime/40"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang} disabled={!isLanguageAvailable(lang)}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">
        {isTemplate ? (
          <TemplateBlockAssemblyView
            blocks={blocks}
            baseCode={baseCode}
            rawTemplate={rawTemplate}
            placements={placements}
            onChange={onChange}
            language={language}
            primaryLanguage={primaryLanguage}
            correctOrder={correctOrder}
            shuffleKey={shuffleKey}
          />
        ) : (
          <FreeBlockAssemblyView
            blocks={blocks}
            placements={placements}
            onChange={onChange}
            shuffleKey={shuffleKey}
          />
        )}
      </div>
    </div>
  )
}

export { isAssemblyComplete }
