# Code Trainer Frontend — конвенции разработки

Документ фиксирует архитектуру, структуру и правила для [`fixed/frontend`](./REQUIREMENTS.md) — в паре с [`fixed/backend/CONVENTIONS.md`](../backend/CONVENTIONS.md).

Основа — **feature layer** (горизонтальные слои FSD), по образцу legacy [`frontend/`](../../frontend/), без переноса технического долга старого API.

**Не путаем с backend:** там **feature-first modular monolith** (ось — `features/`). На фронте ось — **слои** (`app` → `pages` → `widgets` → `features` → `shared`); `features/` — один слой со своей зоной, а не «всё продуктовое сюда».

---

## 1. Принципы

### 1.1. Продукт

UI — тонкий клиент над `fixed/backend`. Бизнес-правила проверки кода **только на backend**; фронт отображает payload, собирает ввод, polling, ошибки.

### 1.2. Архитектурные принципы

| # | Принцип | Смысл |
|---|---------|-------|
| 1 | **Feature layer** | Код распределён по слоям FSD; `features/` — сценарии и действия пользователя, не весь UI |
| 2 | **Слои внутри фичи** | В зрелой фиче: `api/` → `hooks/` → `ui/` → `model/` (как router → use case на backend) |
| 3 | **Композиция на pages** | Страница связывает route, widgets и feature-hooks; без бизнес-логики в pages |
| 4 | **Один API-клиент** | Все HTTP через `shared/api/`; типы из OpenAPI |
| 5 | **Server state = Query** | TanStack Query для GET и mutations с invalidation |
| 6 | **Client state минимален** | Zustand только для auth tokens / UI prefs |
| 7 | **Типы из контракта** | `openapi-typescript`; не дублировать DTO вручную |
| 8 | **Widgets = тяжёлый UI** | Monaco, React Flow, block board — в `widgets/`; без привязки к route |
| 9 | **Паритет с backend** | Имена фич зеркалят backend: `catalog`, `demo`, `auth`, … |
| 10 | **Не тащить legacy целиком** | Копируем файлы точечно; каждый перенос — адаптация под новый API |

### 1.3. Чего избегаем

- **Feature-first на фронте** — сваливать экраны, редакторы и API в один `features/*` без слоёв
- Импорты «вверх» по слоям (`features/` → `widgets/`, `shared/` → `features/`)
- Вызовы `fetch` из `pages/` или `widgets/`
- Дублирование legacy OpenAPI schema (старый backend)
- Бизнес-валидация «правильности кода» на клиенте
- Гигантские `useEffect` вместо query/mutation hooks

---

## 2. Стек

| Слой | Технология | Версия (ориентир) |
|------|------------|-------------------|
| Runtime | React | 18.x |
| Bundler | Vite | 6–8.x |
| Language | TypeScript | strict |
| Routing | react-router-dom | 7.x |
| Server state | @tanstack/react-query | 5.x |
| HTTP | axios | 1.x |
| Forms | controlled + zod (auth) | — |
| Editor | @monaco-editor/react | 4.x |
| Flowchart | react-flow-renderer | 10.x (как legacy; TODO: xyflow) |
| CSS | Tailwind CSS | 3.x |
| UI kit | [shadcn/ui](https://ui.shadcn.com) (Radix + Tailwind) | new-york |
| Icons | lucide-react | — |

**Правило:** не пишем собственные примитивы (Button, Input, Card…). Берём из shadcn в `shared/ui/`, тема — CSS variables в `index.css`.

---

## 3. Слои и зоны ответственности

### 3.1. Горизонтальные слои (сверху вниз)

| Слой | Ответственность | Примеры |
|------|-----------------|---------|
| **app** | Bootstrap, router, глобальные providers | `App.tsx`, `router.tsx` |
| **pages** | Route-screen: композиция widgets + feature hooks | `DemoTaskPage`, `LoginPage` |
| **widgets** | Крупные UI-блоки без знания URL | `TaskWorkspace`, `BlockEditor` |
| **features** | Пользовательские сценарии, mutations, feature UI | `useTaskSolver`, `LoginForm` |
| **shared** | API, design system, utils, config | `catalogClient`, `Button` |

Импорт только **вниз** по таблице (верхний слой → нижние).

### 3.2. `features/` — слой, не свалка

Фича = bounded context по backend (`auth`, `catalog`, `demo`, …), но **не** страница и **не** Monaco-редактор.

```
features/{name}/
├── api/              # query keys, thin wrappers над shared/api (опционально)
├── hooks/            # useX, mutations, orchestration
├── ui/               # компоненты только этой фичи (формы, списки)
├── model/            # pure TS: mappers, normalize, types без React
└── index.ts          # public API фичи (реэкспорт hooks + ui)
```

**Публичный контракт фичи** — только через `index.ts`. Соседние фичи не импортируют `features/foo/hooks/useBar.ts` напрямую.

### 3.3. Куда класть новый код

| Нужно… | Слой |
|--------|------|
| Новый URL / экран | `pages/` + запись в `app/router.tsx` |
| Monaco, flowchart, task board | `widgets/` |
| Submit flow, auth, catalog fetch | `features/` |
| HTTP client, кнопка, `apiErrors` | `shared/` (shadcn primitives в `shared/ui/`) |
| Чистая функция сборки block code | `features/task-solving/model/` или `widgets/block-editor/lib/` |

---

## 4. Структура репозитория

```
fixed/frontend/
├── REQUIREMENTS.md
├── CONVENTIONS.md
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── openapi/
│   └── openapi.json          # npm run openapi:export
│
└── src/
    ├── main.tsx
    ├── index.css
    │
    ├── app/
    │   ├── App.tsx
    │   └── router.tsx
    │
    ├── pages/
    │   ├── Auth/
    │   ├── Demo/
    │   ├── Student/
    │   ├── Teacher/          # фаза 2
    │   └── Admin/              # фаза 2
    │
    ├── widgets/
    │   ├── task-workspace/
    │   ├── code-editor/
    │   ├── block-editor/
    │   └── flowchart-editor/
    │
    ├── features/
    │   ├── auth/
    │   ├── catalog/
    │   ├── demo/
    │   ├── submissions/
    │   ├── progress/
    │   ├── curriculum/       # фаза 2
    │   └── task-solving/
    │
    └── shared/
        ├── api/
        ├── types/
        ├── ui/
        ├── hooks/
        ├── utils/
        ├── config/
        └── providers/
```

### Правила импортов

```
app        → pages, widgets, features, shared
pages      → widgets, features, shared
widgets    → features, shared
features   → shared
shared     → (ничего из верхних слоёв)
```

**Склейка сценария** — на `pages/`:

```tsx
// pages/Demo/DemoTaskPage.tsx
const solver = useTaskSolver({ mode: 'demo', taskId });
return <TaskWorkspace task={task} solver={solver} />;
```

---

## 5. API-слой

### 5.1. Базовый клиент

```typescript
// shared/api/client.ts
// baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api'
// Request: Authorization: Bearer <access>
// Response: error envelope { error: { code, message, details? } }
```

### 5.2. Доменные клиенты (1 файл ≈ 1 backend feature)

| Модуль | Эндпоинты |
|--------|-----------|
| `catalogClient.ts` | `/catalog/tasks` |
| `demoClient.ts` | `/demo/check` |
| `authClient.ts` | `/auth/*` |
| `submissionsClient.ts` | `/submissions/*` |
| `progressClient.ts` | `/progress/*` |
| `curriculumClient.ts` | `/curriculum/*` |
| `languagesClient.ts` | `/languages` |

### 5.3. OpenAPI workflow

```bash
# backend должен быть запущен
npm run openapi:export    # curl /api/openapi.json → openapi/openapi.json
npm run codegen:api       # openapi-typescript → src/shared/api/generated/schema.ts
```

Тонкие обёртки в `shared/types/` реэкспортируют нужные схемы; **не редактировать** `generated/` вручную.

### 5.4. Ошибки

Маппинг `error.code` → пользовательское сообщение в `shared/utils/apiErrors.ts`:

| code | UX |
|------|-----|
| `VALIDATION_ERROR` | Подсветка полей / toast |
| `UNAUTHORIZED` | Refresh или redirect login |
| `FORBIDDEN` | Toast «Недостаточно прав» |
| `RATE_LIMIT_EXCEEDED` | Toast + disable submit |
| `NOT_FOUND` | Empty state |

---

## 6. Auth

### 6.1. Хранение

- `access_token`, `refresh_token` — `localStorage` (ключи с префиксом `ct_`)
- При старте `App.tsx`: `GET /api/auth/me` если есть access token
- При 401 на API: попытка `POST /api/auth/refresh` → retry; иначе logout

### 6.2. Protected routes

```tsx
<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
```

Роль нормализуется lowercase (как backend `normalize_role`).

---

## 7. Task solving

### 7.1. Единый фасад (feature layer)

`features/task-solving/hooks/useTaskSolver.ts` — как legacy, но:

| Параметр | Demo | Student |
|----------|------|---------|
| `mode` | `'demo'` | `'student'` |
| submit | `demoClient.submitCheck` + poll | `submissionsClient.create` + poll |
| auth | не требуется | Bearer обязателен |

### 7.2. Workspace (widget layer)

`widgets/task-workspace/TaskWorkspace.tsx`:

- Props: `task`, `solver` (из `features/task-solving`)
- Ветвление по `task.task_type`; **не** вызывает API напрямую
- Панель результатов: compiler / linter / pattern / test_results

### 7.3. Polling

```typescript
// shared/hooks/useJobPoll.ts
// interval 500ms, max 60s, stop on terminal status
```

Используется demo и submissions одинаково; разный `fetchResult`.

---

## 8. Стили и UI

- **shadcn/ui** — примитивы в `shared/ui/` (`button`, `card`, `input`, `label`, `badge`, `alert`, …)
- Тема: тёмная, primary = lime (`index.css` CSS variables + `tailwind.config.js`)
- Добавление компонента: `npx shadcn@latest add <name>` (конфиг: `components.json`)
- `cn()` — `shared/lib/utils.ts` (clsx + tailwind-merge)
- Композитные блоки (`EmptyState`, `AppShell`) — в `shared/ui/`, собираются из shadcn
- Тексты UI на русском; код и API identifiers на английском

### OpenAPI

```bash
# схема: openapi/openapi.json (экспорт: npm run openapi:export)
npm run codegen:api   # → src/shared/api/generated/schema.ts
```

Тонкие реэкспорты типов — в `shared/types/`; `generated/` не редактировать вручную.

---

## 9. Тестирование

| Уровень | Инструмент | Что покрываем |
|---------|------------|---------------|
| Unit | Vitest | utils, mappers, apiErrors |
| Component | Vitest + RTL | формы auth, EmptyState |
| E2E | Playwright (фаза 1.5) | demo happy path, login+submit |

MVP-ручное QA — по [`REQUIREMENTS.md` §8](./REQUIREMENTS.md#8-критерии-приёмки-mvp-фаза-1).

---

## 10. Dev-окружение

```bash
# terminal 1
cd fixed/backend && make dev

# terminal 2
cd fixed/frontend && npm install && npm run dev
```

`vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true },
  },
},
```

CORS backend уже включает `localhost:5173`.

---

## 11. Порядок реализации (после утверждения документов)

| Шаг | Deliverable |
|-----|-------------|
| 0 | Scaffold: Vite+TS+Tailwind+Router+Query, proxy, README |
| 1 | `shared/api`, OpenAPI codegen, auth flow |
| 2 | Demo: catalog list + `useTaskSolver(demo)` + code editor |
| 3 | Block reorder + flowchart widgets (порт из legacy) |
| 4 | Student: catalog + submissions + results panel |
| 5 | Progress UI |
| 6 | Teacher curriculum (фаза 2) |
| 7 | Playwright smoke tests |

Шаги 5–6 реализованы: `ProgressSummary` на `/`, teacher curriculum, admin debug.  
Шаг 7: `e2e/*.spec.ts` — `npm run test:e2e` (4 smoke, все зелёные при `make dev`).

**Не начинать шаг 1**, пока не согласованы `REQUIREMENTS.md` и этот документ.

---

## 12. Соглашения по коду

- Именование: `PascalCase` компоненты, `camelCase` hooks (`useX`), `kebab-case` файлы страниц опционально
- Экспорт: default для pages, named для features/shared
- Файлы &lt; 300 строк; иначе дробить
- Комментарии — только неочевидный продуктовый контекст
- `TODO(друг)` — спорные решения, ждут владельца продукта
