import { useState, type FormEvent, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { AuthGuestLink, AuthSplitLayout } from "@/shared/ui/AuthLayout"
import SocialAuth, { type SocialProvider } from "@/shared/ui/SocialAuth"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

const REMEMBER_EMAIL_KEY = "tp_remember_email"

export default function LoginPage() {
  const { login, isAuthenticated, isCheckingAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_EMAIL_KEY)))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/"

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [from, isAuthenticated, isCheckingAuth, navigate])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await login(email, password)
      if (remember) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, "Не удалось войти"))
    } finally {
      setIsLoading(false)
    }
  }

  const onSocial = (_provider: SocialProvider) => {
    setError("Вход через соцсети будет доступен позже.")
  }

  return (
    <AuthSplitLayout>
      <form className="auth-form-inner" onSubmit={onSubmit}>
        <h1 className="mb-1.5 text-2xl font-extrabold">С возвращением</h1>
        <p className="mb-6 text-sm text-ink-muted">Войдите, чтобы продолжить обучение.</p>

        {error ? (
          <div className="tp-note mb-3.5 border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-[#ff8198]">
            {error}
          </div>
        ) : null}

        <div className="mb-4 space-y-2">
          <Label htmlFor="email" className="text-[13px] font-semibold text-ink-muted">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
            required
          />
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="password" className="text-[13px] font-semibold text-ink-muted">
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
            required
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <label className="check-row flex cursor-pointer items-center gap-2 text-[13px] text-ink-muted">
            <span
              role="checkbox"
              aria-checked={remember}
              tabIndex={0}
              className={cn("checkbox", remember && "on")}
              onClick={() => setRemember((value) => !value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setRemember((value) => !value)
                }
              }}
            />
            Запомнить меня
          </label>
          <Link to="/reset-password" className="text-[13px] font-semibold text-lime hover:underline">
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" disabled={isLoading} className="h-[42px] w-full">
          {isLoading ? "Входим…" : "Войти"}
        </Button>

        <AuthGuestLink />

        <p className="mt-5 text-center text-[13.5px] text-ink-muted">
          Нет аккаунта?{" "}
          <Link to="/register" className="font-semibold text-[#b89bff] hover:underline">
            Зарегистрироваться
          </Link>
        </p>

        <SocialAuth onPick={onSocial} />
      </form>
    </AuthSplitLayout>
  )
}
