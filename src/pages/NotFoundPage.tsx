import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/shared/ui/button"
import EmptyState from "@/shared/ui/EmptyState"

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Страница не найдена"
      description="Проверьте адрес или вернитесь на главную."
      action={
        <Button variant="ghost" asChild>
          <Link to="/">На главную</Link>
        </Button>
      }
      className="mx-4 my-16"
    />
  )
}
