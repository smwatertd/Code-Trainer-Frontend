import { useCallback, useEffect, useRef, useState } from "react"

const TERMINAL = new Set(["SUCCESS", "FAILED", "TIMEOUT"])

export function useJobPoll<T extends { status: string }>(
  fetchResult: () => Promise<T>,
  jobId: string | number | null,
  enabled: boolean,
): { result: T | null; isPolling: boolean; error: string | null } {
  const [result, setResult] = useState<T | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const attemptsRef = useRef(0)

  const poll = useCallback(async () => {
    if (jobId == null) return
    setIsPolling(true)
    setError(null)
    attemptsRef.current = 0

    const tick = async (): Promise<void> => {
      attemptsRef.current += 1
      if (attemptsRef.current > 120) {
        setError("Превышено время ожидания проверки")
        setIsPolling(false)
        return
      }

      try {
        const next = await fetchResult()
        setResult(next)
        if (TERMINAL.has(next.status.toUpperCase())) {
          setIsPolling(false)
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка опроса")
        setIsPolling(false)
        return
      }

      window.setTimeout(() => {
        void tick()
      }, 500)
    }

    await tick()
  }, [fetchResult, jobId])

  useEffect(() => {
    if (!enabled || jobId == null) return
    void poll()
  }, [enabled, jobId, poll])

  return { result, isPolling, error }
}
