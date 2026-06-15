import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/shared/ui/cn"

export type TrackLanguageOption = {
  id: string
  glyph: string
  label: string
  route: string
}

/** Языки с загруженным curriculum bundle на backend. */
export const CURRICULUM_TRACK_LANGUAGE_IDS = new Set([
  "python",
  "pascal",
  "cpp",
  "csharp",
  "java",
])

export const TRACK_LANGUAGE_OPTIONS: TrackLanguageOption[] = [
  { id: "python", glyph: "Py", label: "Python", route: "/learn/python" },
  { id: "pascal", glyph: "Pas", label: "Pascal", route: "/learn/pascal" },
  { id: "cpp", glyph: "C++", label: "C++", route: "/learn/cpp" },
  { id: "csharp", glyph: "C#", label: "C#", route: "/learn/csharp" },
  { id: "java", glyph: "Jv", label: "Java", route: "/learn/java" },
]

export function isTrackLanguageAvailable(languageId: string): boolean {
  return CURRICULUM_TRACK_LANGUAGE_IDS.has(languageId)
}

type LangMiniProps = {
  language: string
  className?: string
}

export default function LangMini({ language, className }: LangMiniProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current =
    TRACK_LANGUAGE_OPTIONS.find((option) => option.id === language) ?? TRACK_LANGUAGE_OPTIONS[0]

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocumentClick)
    return () => document.removeEventListener("mousedown", onDocumentClick)
  }, [])

  const optionClassName = (optionId: string, available: boolean) =>
    cn(
      "lang-mini-opt flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13.5px] no-underline transition",
      optionId === language && "on",
      available
        ? "cursor-pointer text-ink hover:bg-surface-2"
        : "cursor-default text-ink-muted opacity-60",
    )

  return (
    <div className={cn("lang-mini relative z-50", className)} ref={rootRef}>
      <button
        type="button"
        className="lang-mini-btn"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Сменить язык трека"
        data-testid="track-language-toggle"
      >
        <span className="g">{current.glyph}</span>
        <span>{current.label}</span>
        <span className="text-[10px] text-ink-faint">▾</span>
      </button>
      {open ? (
        <div className="lang-mini-menu" role="listbox">
          {TRACK_LANGUAGE_OPTIONS.map((option) => {
            const available = isTrackLanguageAvailable(option.id)
            if (available) {
              return (
                <Link
                  key={option.id}
                  to={option.route}
                  role="option"
                  aria-selected={option.id === language}
                  className={optionClassName(option.id, true)}
                  data-testid={`track-language-${option.id}`}
                  onClick={() => {
                    setOpen(false)
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("tp_last_track_language", option.id)
                    }
                  }}
                >
                  <span className="g">{option.glyph}</span>
                  {option.label}
                </Link>
              )
            }
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={option.id === language}
                disabled
                className={optionClassName(option.id, false)}
              >
                <span className="g">{option.glyph}</span>
                {option.label}
                <span className="soon">скоро</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
