/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/client/src/pages/workersPage/modals/AddWorkersModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddWorkersModal from "./AddWorkersModal";

// Мокаем зависимости
vi.mock("src/api/workers/create", () => ({
  useCreateWorkers: vi.fn(),
}));

// Импортируем моки для использования в тестах
import { useCreateWorkers } from "src/api/workers/create";

 

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <MantineProvider>{ui}</MantineProvider>
    </QueryClientProvider>,
  );
};

describe("AddWorkersModal", () => {
  const mockOnClose = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Настраиваем мок для useCreateWorkers
    vi.mocked(useCreateWorkers).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any);
  });

  it("не отображает модальное окно, когда opened=false", () => {
    renderWithProviders(
      <AddWorkersModal opened={false} onClose={mockOnClose} />,
    );

    expect(screen.queryByText("Добавить работника")).not.toBeInTheDocument();
  });

  it("отображает модальное окно, когда opened=true", () => {
    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    expect(screen.getByText("Добавить работника")).toBeInTheDocument();
  });

  it("отображает все поля формы", () => {
    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    expect(screen.getByLabelText(/ФИО/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Телефон/i)).toBeInTheDocument();
  });

  it("вызывает onClose при клике на кнопку 'Отмена'", () => {
    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    const cancelButton = screen.getByText("Отмена");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("сбрасывает форму после успешного создания", async () => {
    const user = userEvent.setup();
    // Настраиваем мок для вызова onSuccess
    vi.mocked(useCreateWorkers).mockReturnValue({
      mutate: vi.fn().mockImplementation((values, { onSuccess }) => {
        onSuccess({
          worker: {
            id: "123",
            email: "ivan@example.com",
            name: "Иван Иванов",
            isAdmin: false,
          },
        } as any);
      }),
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any);

    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    // Заполняем форму
    await user.type(screen.getByLabelText(/ФИО/i), "Иван Иванов");
    await user.type(screen.getByLabelText(/email/i), "ivan@example.com");
    await user.type(screen.getByLabelText(/Пароль/i), "password123");

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Создать" });
    await user.click(submitButton);

    // Проверяем, что onClose был вызван (форма сброшена)
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("показывает ошибки валидации при пустом вводе", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    const submitButton = screen.getByRole("button", { name: "Создать" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("ФИО обязательно")).toBeInTheDocument();
      expect(screen.getByText("Некоректная почта")).toBeInTheDocument();
      expect(screen.getByText("Минимум 6 символов")).toBeInTheDocument();
    });
  });

  it("отправляет данные формы при успешной валидации", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    // Заполняем поля формы
    await user.type(screen.getByLabelText(/ФИО/i), "Иван Иванов");
    await user.type(screen.getByLabelText(/email/i), "ivan@example.com");
    await user.type(screen.getByLabelText(/Пароль/i), "password123");
    await user.type(screen.getByLabelText(/Телефон/i), "+79001234567");

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Создать" });
    await user.click(submitButton);

    // Проверяем, что mutate был вызван с правильными данными
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Иван Иванов",
          email: "ivan@example.com",
          password: "password123",
          phone: "+79001234567",
        }),
        expect.any(Object),
      );
    });
  });

  it("показывает ошибку сервера, если регистрация не удалась", async () => {
    const user = userEvent.setup();
    const errorMessage = "Пользователь с такой почтой уже существует";

    // Мокаем mutate для вызова onError
    vi.mocked(useCreateWorkers).mockReturnValue({
      mutate: vi.fn().mockImplementation((values, { onError }) => {
        onError(new Error(errorMessage) as any);
      }),
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any);

    renderWithProviders(
      <AddWorkersModal opened={true} onClose={mockOnClose} />,
    );

    // Заполняем форму
    await user.type(screen.getByLabelText(/ФИО/i), "Иван Иванов");
    await user.type(screen.getByLabelText(/email/i), "ivan@example.com");
    await user.type(screen.getByLabelText(/Пароль/i), "password123");

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Создать" });
    await user.click(submitButton);

    // Проверяем, что ошибка отображается в поле email
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
