import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/shared/ui/button"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16 text-center">
      <div>
        <div className="text-[84px] font-extrabold leading-none tracking-[-3px]">
          <span className="text-lime">4</span>
          <span className="font-serif italic text-purple">0</span>
          <span className="text-lime">4</span>
        </div>
        <h1 className="mt-3.5 text-[22px] font-extrabold">Страница потерялась</h1>
        <p className="mt-1.5 font-mono text-sm text-ink-muted">404 · маршрут не найден</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Назад
          </Button>
          <Button asChild>
            <Link to="/">На главную</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
