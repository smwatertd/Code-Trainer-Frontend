# Code Trainer — Frontend (fixed)

Веб-UI для [`fixed/backend`](../backend/README.md).

## Документы

1. [REQUIREMENTS.md](./REQUIREMENTS.md) — фазы MVP, критерии приёмки
2. [CONVENTIONS.md](./CONVENTIONS.md) — FSD, shadcn/ui
3. [../TESTING.md](../TESTING.md) — ручной чеклист + автотесты

## Статус

**MVP фазы 1–3:** demo, auth, submissions, progress, curriculum UI, **группы, наборы заданий, дашборд группы**.

## Ручное тестирование

```bash
# terminal 1 — API + Postgres + Redis
cd fixed && make dev && make seed-dev

# terminal 2
cd fixed && make frontend-dev   # http://localhost:5173
```

### Dev-аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| `student@code-trainer.dev` | `student123` | student |
| `teacher@code-trainer.dev` | `teacher123` | teacher |
| `admin@code-trainer.dev` | `admin123` | admin |

Демо без регистрации: http://localhost:5173/demo

## Маршруты

| URL | Описание |
|-----|----------|
| `/demo`, `/demo/tasks/:id` | Демо без auth |
| `/login`, `/register` | Авторизация |
| `/` | Каталог + прогресс curriculum |
| `/tasks/:id` | Решение с submissions |
| `/groups/join` | Вступить в группу (student) |
| `/assignment-sets` | Наборы заданий (student) |
| `/teacher/groups` | Группы (teacher) |
| `/teacher/groups/:id/dashboard` | Дашборд группы |
| `/teacher/assignment-sets` | Наборы (teacher) |
| `/teacher/tasks/:id/curriculum` | Curriculum links |
| `/admin/curriculum/:lang` | Debug/validate YAML |

## Автотесты

```bash
cd fixed/frontend && npm run test
```

Vitest (unit, пока пусто) + Playwright E2E с **мок API** — backend не нужен.

Только Playwright: `npm run test:e2e`

Полный чеклист ручного QA: [../TESTING.md](../TESTING.md).

## OpenAPI

```bash
npm run codegen:api   # после обновления openapi/openapi.json
```

## UI

[shadcn/ui](https://ui.shadcn.com) — `src/shared/ui/`, `components.json`.
