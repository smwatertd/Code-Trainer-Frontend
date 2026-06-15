import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { cn } from "@/shared/ui/cn"

const DEMO_OTP = "123456"
const PENDING_KEY = "tp_pending_email_verify"

export function markEmailVerificationPending(email: string): void {
  sessionStorage.setItem(PENDING_KEY, email)
}

export function clearEmailVerificationPending(): void {
  sessionStorage.removeItem(PENDING_KEY)
}

function isEmailVerified(): boolean {
  return sessionStorage.getItem(PENDING_KEY) == null
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

export default function VerifyEmailBanner() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [dismissed, setDismissed] = useState(false)
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [resendIn, setResendIn] = useState(30)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const pendingEmail = sessionStorage.getItem(PENDING_KEY)
  const visible = Boolean(
    isAuthenticated && user && pendingEmail && !isEmailVerified() && !dismissed,
  )

  useEffect(() => {
    setDismissed(false)
  }, [location.pathname])

  useEffect(() => {
    if (visible) {
      document.body.classList.add("has-banner")
    } else {
      document.body.classList.remove("has-banner")
    }
    return () => document.body.classList.remove("has-banner")
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const timer = window.setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [visible])

  useEffect(() => {
    if (visible) {
      setDigits(["", "", "", "", "", ""])
      setStatus("idle")
      setErrorMsg("")
    }
  }, [pendingEmail, visible])

  const submit = useCallback((codeArr: string[]) => {
    const code = codeArr.join("")
    if (code.length < 6) return
    setStatus("loading")
    setErrorMsg("")
    window.setTimeout(() => {
      if (code === DEMO_OTP) {
        setStatus("success")
        window.setTimeout(() => {
          clearEmailVerificationPending()
          setDismissed(true)
        }, 600)
      } else {
        setStatus("error")
        setErrorMsg("Неверный код. Попробуйте ещё раз.")
        window.setTimeout(() => {
          setDigits(["", "", "", "", "", ""])
          inputsRef.current[0]?.focus()
          setStatus("idle")
        }, 1100)
      }
    }, 700)
  }, [])

  const setDigit = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 1)
    setDigits((previous) => {
      const next = [...previous]
      next[index] = cleaned
      if (cleaned && index < 5) {
        inputsRef.current[index + 1]?.focus()
      }
      if (next.every((digit) => digit !== "") && next.join("").length === 6) {
        submit(next)
      }
      return next
    })
  }

  const onKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
      setDigits((previous) => {
        const next = [...previous]
        next[index - 1] = ""
        return next
      })
      event.preventDefault()
    }
  }

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = (event.clipboardData.getData("text") || "").replace(/[^0-9]/g, "").slice(0, 6)
    if (!text) return
    event.preventDefault()
    const next = ["", "", "", "", "", ""]
    for (let index = 0; index < text.length; index += 1) {
      next[index] = text[index] ?? ""
    }
    setDigits(next)
    const focusIndex = Math.min(text.length, 5)
    inputsRef.current[focusIndex]?.focus()
    if (text.length === 6) submit(next)
  }

  if (!visible) return null

  const otpClass = status === "success" ? "ok" : status === "error" ? "err" : ""

  return (
    <div
      className={cn(
        "verify-banner",
        status === "success" && "ok",
        status === "error" && "err",
      )}
    >
      <div className="verify-inner">
        <div className="verify-text min-w-0">
          <b className="mb-0.5 block text-sm tracking-[-0.2px] text-ink">
            🔒 Подтвердите email
            {status === "success" ? (
              <span className="ml-2 font-semibold text-lime">· подтверждено</span>
            ) : null}
          </b>
          <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-ink-muted">
            <span>
              Мы отправили код на{" "}
              <span className="font-mono font-semibold text-ink">{pendingEmail ?? user?.email}</span>
            </span>
            <span className="text-ink-faint">·</span>
            {resendIn > 0 ? (
              <span className="text-ink-faint">повтор через {formatTime(resendIn)}</span>
            ) : (
              <button
                type="button"
                className="verify-resend font-semibold text-lime"
                onClick={() => {
                  setResendIn(30)
                  setStatus("idle")
                  setErrorMsg("")
                  setDigits(["", "", "", "", "", ""])
                  window.setTimeout(() => inputsRef.current[0]?.focus(), 50)
                }}
              >
                Отправить код повторно
              </button>
            )}
            <span className="text-ink-faint">·</span>
            <span className="font-mono text-ink-faint">тестовый код: {DEMO_OTP}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn("otp", otpClass)}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                className={digit ? "filled" : undefined}
                disabled={status === "loading" || status === "success"}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={onKeyDown(index)}
                onPaste={onPaste}
                onFocus={(event) => event.target.select()}
              />
            ))}
          </div>
          <div className={cn("otp-status flex min-w-[130px] items-center gap-2 text-[12.5px]", status)}>
            {status === "loading" ? (
              <>
                <span className="tp-spinner inline-block h-4 w-4 shrink-0" />
                Проверка…
              </>
            ) : null}
            {status === "error" ? (
              <>
                <span className="text-sm font-extrabold">!</span>
                {errorMsg}
              </>
            ) : null}
            {status === "success" ? (
              <>
                <span className="text-sm font-extrabold">✓</span>
                Email подтверждён
              </>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="verify-close"
          title="Скрыть до следующей страницы"
          disabled={status === "loading" || status === "success"}
          onClick={() => setDismissed(true)}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
