import { Link } from "react-router-dom"

export default function GuestBanner() {
  return (
    <div
      className="border-b border-primary/20 bg-primary/5 px-4 py-2.5 text-center text-sm text-foreground"
      role="status"
      data-testid="guest-banner"
    >
      Вы не вошли в аккаунт — задачи можно решать, но прогресс не сохраняется.{" "}
      <Link to="/login" className="font-semibold text-primary hover:underline">
        Войти
      </Link>{" "}
      или{" "}
      <Link to="/register" className="font-semibold text-primary hover:underline">
        зарегистрироваться
      </Link>
      , чтобы сохранять результаты.
    </div>
  )
}
