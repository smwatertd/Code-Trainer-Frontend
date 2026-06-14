import { useState, type FormEvent, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { AuthCardLayout } from "@/shared/ui/AuthLayout"
import Brand from "@/shared/ui/Brand"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function RegisterPage() {
  const { register, isAuthenticated, isCheckingAuth } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, isCheckingAuth, navigate])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await register(name, email, password)
      navigate("/", { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, "Не удалось зарегистрироваться"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCardLayout>
      <form onSubmit={onSubmit}>
        <div className="mb-[18px] flex justify-center">
          <Brand />
        </div>

        <h1 className="mb-1.5 text-center text-2xl font-extrabold">Создать аккаунт</h1>
        <p className="mb-6 text-center text-sm text-ink-muted">Бесплатно. Старт за минуту.</p>

        {error ? (
          <div className="tp-note mb-3.5 border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-[#ff8198]">
            {error}
          </div>
        ) : null}

        <div className="mb-4 space-y-2">
          <Label htmlFor="name" className="text-[13px] font-semibold text-ink-muted">
            Имя
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Влада"
            className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
            required
          />
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="email" className="text-[13px] font-semibold text-ink-muted">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
            required
          />
        </div>

        <div className="mb-5 space-y-2">
          <Label htmlFor="password" className="text-[13px] font-semibold text-ink-muted">
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Минимум 8 символов"
            minLength={8}
            className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="h-[42px] w-full">
          {isLoading ? "Создаём…" : "Зарегистрироваться"}
        </Button>

        <p className="mt-3.5 text-center text-xs text-ink-faint">
          Регистрируясь, вы принимаете условия использования
        </p>

        <p className="mt-3.5 text-center text-[13.5px] text-ink-muted">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="font-semibold text-lime hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </AuthCardLayout>
  )
}
