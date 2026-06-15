import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { AuthCardLayout } from "@/shared/ui/AuthLayout"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (email.includes("@")) {
      setSent(true)
    }
  }

  return (
    <AuthCardLayout>
      <form className="text-center" onSubmit={onSubmit}>
        <div className="mx-auto mb-[18px] grid h-16 w-16 place-items-center rounded-[18px] border border-lime/30 bg-lime-soft text-[26px] text-lime">
          {sent ? "✓" : "↻"}
        </div>
        <h1 className="mb-1.5 text-[22px] font-extrabold">
          {sent ? "Письмо отправлено" : "Сброс пароля"}
        </h1>
        <p className="mb-[22px] text-sm text-ink-muted">
          {sent
            ? `Если ${email} есть в системе, мы отправили ссылку для восстановления.`
            : "Введите email — пришлём ссылку для восстановления."}
        </p>

        {!sent ? (
          <>
            <div className="mb-4 space-y-2 text-left">
              <Label htmlFor="reset-email" className="text-[13px] font-semibold text-ink-muted">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-[42px] border-[#333d4f] bg-bg-2 focus-visible:ring-lime"
                autoFocus
                required
              />
            </div>
            <Button type="submit" className="h-[42px] w-full">
              Отправить ссылку
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="h-[42px] w-full"
            onClick={() => setSent(false)}
          >
            Отправить ещё раз
          </Button>
        )}

        <Link
          to="/login"
          className="mt-[18px] inline-block text-[13.5px] text-ink-muted hover:text-ink"
        >
          ← Назад ко входу
        </Link>
      </form>
    </AuthCardLayout>
  )
}
