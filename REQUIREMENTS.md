# Code Trainer Frontend — требования (MVP)

Веб-интерфейс для ручного тестирования и использования API из [`fixed/backend`](../backend/README.md).

**Цель MVP:** заменить Postman — пользователь может пройти весь backend-flow в браузере: demo → регистрация → решение задач → прогресс.

**Источники:**
- API-контракт: `fixed/backend` (22 эндпоинта, OpenAPI `/api/openapi.json`)
- UX-паттерны: legacy [`frontend/`](../../frontend/) (demo, task workspace, Monaco, block/flowchart)
- Архитектура: [`CONVENTIONS.md`](./CONVENTIONS.md)

---

## 1. Пользователи и роли

| Роль | MVP | Позже |
|------|-----|-------|
| **Аноним** | Demo: каталог + проверка без сохранения | — |
| **student** | Каталог, решение, submissions, progress | groups, recommendations |
| **teacher** | То же + curriculum links (CRUD) | assignment sets, groups |
| **admin** | Curriculum validate/debug | полная admin-панель |

Роль `guest` в JWT — без permissions (как на backend); в UI трактуем как «нужна регистрация».

---

## 2. MVP-фазы (синхронно с backend)

### Фаза 1 — Ручное QA (приоритет)

Покрывает чеклист ручного тестирования backend без Postman.

| # | Экран / flow | Backend API | Критерий готовности |
|---|--------------|-------------|---------------------|
| 1.1 | Список языков (bootstrap) | `GET /api/languages` | Языки в селекторе редактора |
| 1.2 | Demo: список задач | `GET /api/catalog/tasks` | `/demo` — карточки задач 1–10 |
| 1.3 | Demo: решение задачи | `POST/GET /api/demo/check` | Все типы: translation, block_reorder, flowchart |
| 1.4 | Auth: register / login | `POST /api/auth/register`, `login` | Токены в storage, redirect на `/` |
| 1.5 | Auth: logout, session | `POST /api/auth/logout`, `GET /api/auth/me` | Header с email/role, logout |
| 1.6 | Student: каталог | `GET /api/catalog/tasks/{id}` | `/tasks/:id` — детали без ответов |
| 1.7 | Student: submit | `POST/GET /api/submissions` | Проверка с сохранением, панель результатов |
| 1.8 | Student: progress | `GET /api/progress/tasks/{id}`, `.../curriculum/{lang}/{lc}` | Статус после submit |
| 1.9 | Ошибки API | `{ error: { code, message, details? } }` | Toast/inline по коду ошибки |

### Фаза 2 — Teacher / Admin

| # | Экран | API |
|---|-------|-----|
| 2.1 | Curriculum links для задачи | `GET/POST/PATCH/DELETE /api/curriculum/tasks/...` |
| 2.2 | Validate link (форма) | `POST /api/curriculum/tasks/validate-link` |
| 2.3 | Admin: curriculum debug | `GET /api/curriculum/{lang}/debug` |
| 2.4 | Admin: curriculum validate | `GET /api/curriculum/{lang}/validate` |

### Фаза 3 — Позже (вне MVP)

- Groups, assignment sets, teacher cabinet (legacy parity)
- Email verification (ждёт `TODO(друг)` на backend)
- CRUD задач через UI
- Support tickets, teacher requests
- Полная admin-панель (users, roles, analytics)

---

## 3. Task workspace — типы задач

Seed tasks 1–10 должны открываться и проверяться из UI.

| task_type (API) | UI-режим | Поля submit/demo | Виджет (из legacy) |
|-----------------|----------|------------------|---------------------|
| `translation` | Monaco editor | `code`, `language` | `StudentCodeSplit` |
| `task_build_from_blocks` | Block reorder | `code`, `block_order`, `language` | `BlockEditor` / placements |
| `task_flowchart_to_code` | Flowchart + code | `code`, `nodes`, `edges`, `language` | `StudentFlowchartSplit` |

**Compiled / pattern (tasks 7–10):**
- Выбор языка из `payload.target_language` / task context
- Результаты: `compiler_errors`, `pattern_errors`, `test_results`

**Polling:**
- Demo: `POST /api/demo/check` → poll `GET /api/demo/check/{job_id}` до terminal
- Submissions: при `status: queued` — poll `GET /api/submissions/{id}` (или abandon)

---

## 4. Нефункциональные требования

| Требование | Значение |
|------------|----------|
| Браузеры | Chrome, Firefox, Safari (последние 2 версии) |
| Язык UI | Русский (как legacy) |
| API base URL | `VITE_API_BASE_URL` (default `/api`, proxy → `:8000`) |
| Auth | Bearer access token; refresh при 401 (как legacy `App.tsx`) |
| Типизация API | OpenAPI codegen из backend |
| Состояние сервера | TanStack Query |
| Локальный draft | localStorage (code по task_id), опционально |
| Доступность | Клавиатурная навигация в формах; Monaco — best effort |

---

## 5. Явные ограничения MVP

1. **Нет Postman** — все сценарии чеклиста backend проходятся в UI.
2. **Один backend** — только `fixed/backend`, не legacy `vlada/backend`.
3. **Catalog sanitization** — UI не показывает `correct_order`, `test_cases` из payload (даже если backend отдаёт `flow_spec` на task 6 — не рендерить как «ответ»).
4. **Без email verification** — register сразу логинит (как backend сейчас).
5. **In-memory execution** — в dev submissions часто сразу `success`/`failed`; UI показывает статус как есть.
6. **Docker runners** — C++/Pascal работают только если backend + `make runners`; UI показывает compile errors понятно.

---

## 6. Карта маршрутов (MVP)

```
/demo                          — каталог (аноним)
/demo/tasks/:id                — demo workspace

/login, /register              — auth

/                              — student home (каталог + progress summary)
/tasks/:id                     — student workspace (submissions)

/teacher/tasks/:id/curriculum  — curriculum links (фаза 2)
/admin/curriculum/:lang        — debug/validate (фаза 2)
```

---

## 7. Заимствования из legacy frontend

| Берём | Не берём (пока) |
|-------|-----------------|
| Feature layer (FSD): `app → pages → widgets → features → shared` | Старые пути API (`/catalogs`, `/submissions/lint`) |
| `useTaskSolver` (упрощённый) | Email code, OAuth callback |
| `StudentTaskWorkspace` + editors | Полный admin-panel |
| Tailwind-токены (`bg-bg`, `ink`, …) | Pascal showcase / learn routes |
| `ProtectedRoute`, auth refresh | Groups, assignments CRUD |
| OpenAPI codegen pipeline | 55 файлов task-editor |

---

## 8. Критерии приёмки MVP (фаза 1)

- [x] `make dev` (backend) + `npm run dev` (frontend) — работает без ручной настройки CORS
- [x] Demo task 2: block reorder success/fail виден в UI
- [x] Demo task 9 (C++): compile error или success (при runners)
- [x] Register → login → submit task 4 → progress `loops` обновился
- [x] Logout → demo всё ещё доступен
- [x] 401 на protected route → redirect `/login`
- [x] Teacher curriculum (фаза 2) — link CRUD на task 5

---

## 9. Открытые продуктовые вопросы

| # | Вопрос | Допущение MVP |
|---|--------|---------------|
| 1 | Task 1: target cpp, но тесты шлют python | UI: язык по умолчанию из `payload.target_language`, пользователь может сменить |
| 2 | Скрывать `flow_spec` на task 6? | Не показывать в student view; teacher/admin — можно в фазе 2 |
| 3 | `react-flow-renderer` deprecated | MVP: тот же пакет что legacy; миграция на `@xyflow/react` — отдельная задача |
