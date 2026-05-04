# 🔄 API и tRPC-роуты

Все API-вызовы реализованы через **tRPC**, что обеспечивает типобезопасность от бэкенда до фронтенда.

## 🧩 Структура роутов

Роуты находятся в `packages/server/src/routers/`:

- `auth.ts` — авторизация
- `booking.ts` — управление записями
- `workers.ts` — сотрудники
- `services.ts` — услуги
- `shifts.ts` — смены
- `index.ts` — объединяет все роуты в `appRouter`

## 🧱 Пример tRPC-роута

```ts
// packages/server/src/routers/auth.ts
const authRouter = router({
  login: procedure
    .input(loginSchema) // zod-схема
    .mutation(async ({ input }) => {
      // логика входа
    }),
});
```

На фронтенде:

```ts
// packages/client/src/api/auth
const { data, mutate } = trpc.auth.login.useMutation();
```

## 🔐 Авторизация

- Все приватные роуты используют `protectedProcedure`, проверяющий JWT.
- Токен передаётся через cookies или заголовки.
- Пример:
  ```ts
  const protectedProcedure = middleware(async ({ ctx, next }) => {
    const token = ctx.req.cookies.token;
    if (!token) throw new Error('UNAUTHORIZED');
    const user = verifyToken(token);
    return next({ ctx: { ...ctx, user } });
  });
  ```

## 📥 Валидация

- Все входные данные валидируются через `zod`-схемы из `shared`.
- Схемы находятся в `packages/shared/src/validation/`:
  - `auth.ts`
  - `booking.ts`
  - `workers.ts`
  - и т.д.

## 📡 Использование на фронтенде

- tRPC клиент настроен в `packages/client/src/api/client.ts`.
- Используется `createTRPCReact<AppRouter>()`.
- Пример запроса:
  ```ts
  const { data } = trpc.booking.getAll.useQuery();
  ```

> 💡 Благодаря `@trpc/react-query`, данные автоматически кешируются и обновляются.