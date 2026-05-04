# 🔄 CI/CD и инфраструктура

Автоматизация сборки, тестирования и деплоя.

## 🛠️ Текущее состояние

- Нет файлов `./github/workflows/`
- Нет автоматических тестов
- Нет pre-commit хуков кроме `husky` для коммитов

## 🎯 Цель

Настроить **надёжный CI/CD**.

## 📦 GitHub Actions

Создайте `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Установить pnpm
        run: npm install -g pnpm
      - name: Установить зависимости
        run: pnpm install
      - name: Линтинг
        run: pnpm run lint
      - name: Тесты
        run: pnpm --filter server test
        # Добавить тесты для shared, если будут

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm --filter client build
      - run: pnpm --filter server build
```

## 🔒 Защита веток

- Запретить push в `main` напрямую
- Требовать прохождения CI
- Минимум 1 ревью

## 🚀 Деплой

### Vercel (для клиента)
- Подключите репозиторий
- Укажите `packages/client` как root
- Сборка: `pnpm build`

### Render / Railway (для сервера)
- Поддержка Node.js + PostgreSQL
- Автоматический деплой при push
- Переменные окружения: `DATABASE_URL`, `JWT_SECRET`

## 🐳 Docker (опционально)

Можно создать `Dockerfile`:

```dockerfile
# packages/server/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install --prod
CMD ["pnpm", "start"]
```

> 💡 Совет: Начните с простого CI — линтинг + тесты — это уже большой шаг вперёд.