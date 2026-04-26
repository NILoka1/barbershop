## Формат коммита
тип(scope): описание


- **тип** — что сделано
- **scope** — какой пакет затронут
- **описание** — кратко, что именно, на русском или английском

---

## Типы коммитов

| Тип | Когда использовать |
|-----|-------------------|
| `feat` | Новая фича, endpoint, компонент |
| `fix` | Исправление бага |
| `docs` | Документация, readme, комментарии |
| `style` | Форматирование, отступы, точки с запятой |
| `refactor` | Переписал код без новой функциональности |
| `chore` | Рутина: зависимости, конфиги, настройки |
| `test` | Тесты |
| `perf` | Оптимизация производительности |
| `ci` | CI/CD, GitHub Actions |

---

## Scope (пакеты)

| Scope | Что внутри |
|-------|-----------|
| `server` | API, Prisma ORM, эндпоинты, middleware |
| `client` | React, хуки к API, кастомные хуки, UI |
| `shared` | Общие типы, интерфейсы, константы |
| `root` | Корневые конфиги, общие настройки монорепозитория |

---

## Примеры для Server

```bash
git commit -m "feat(server): add POST /appointments endpoint"
git commit -m "feat(server): add Prisma schema for barbers"
git commit -m "fix(server): handle duplicate booking time error"
git commit -m "refactor(server): extract auth middleware"
git commit -m "chore(server): update prisma to 5.x"
```

```bash
git commit -m "feat(client): add useAppointments hook"
git commit -m "feat(client): add BarbersPage component"
git commit -m "fix(client): handle loading state in useAuth"
git commit -m "style(client): format with prettier"
git commit -m "refactor(client): extract BookingForm component"
```

```bash
git commit -m "chore(root): update eslint config"
git commit -m "chore(root): add commitlint to monorepo"
git commit -m "ci(root): add GitHub Actions workflow"
git commit -m "docs(root): update contributing guide"
```
