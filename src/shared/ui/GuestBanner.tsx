import { Link } from "react-router-dom"

export default function GuestBanner() {
  return (
    <div
      className="tp-note lime text-center text-sm"
      role="status"
      data-testid="guest-banner"
    >
      Вы не вошли в аккаунт — задачи можно решать, но прогресс не сохраняется.{" "}
      <Link to="/login" className="font-semibold text-lime hover:underline">
        Войти
      </Link>{" "}
      или{" "}
      <Link to="/register" className="font-semibold text-lime hover:underline">
        зарегистрироваться
      </Link>
      , чтобы сохранять результаты.
    </div>
  )
}
