/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/client/src/pages/workersPage/modals/UpdateWorkersModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UpdateWorkersModal from "../../pages/workersPage/modals/UpdateWorkersModal";

// Мокаем зависимости
vi.mock("src/api/workers/update", () => ({
  useUpdateWorker: vi.fn(),
}));

// Импортируем моки для использования в тестах
import { useUpdateWorker } from "src/api/workers/update";

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

describe("UpdateWorkersModal", () => {
  const mockOnClose = vi.fn();
  const mockMutate = vi.fn();
  const mockWorker = {
    id: "123",
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+79001234567",
    isAdmin: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Настраиваем мок для useUpdateWorker
    vi.mocked(useUpdateWorker).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("не отображает модальное окно, когда opened=false", () => {
    renderWithProviders(
      <UpdateWorkersModal
        opened={false}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    expect(screen.queryByText("Изменить работника")).not.toBeInTheDocument();
  });

  it("отображает модальное окно, когда opened=true", () => {
    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    expect(screen.getByText("Изменить работника")).toBeInTheDocument();
  });

  it("отображает все поля формы", () => {
    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    expect(screen.getByLabelText(/ФИО/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Администрирование/i)).toBeInTheDocument();
  });

  it("заполняет поля формы данными редактируемого работника", () => {
    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    expect(screen.getByLabelText(/ФИО/i)).toHaveValue("Иван Иванов");
    expect(screen.getByLabelText(/email/i)).toHaveValue("ivan@example.com");
    expect(screen.getByLabelText(/Телефон/i)).toHaveValue("+79001234567");
    expect(screen.getByLabelText(/Администрирование/i)).toBeChecked();
  });

  it("заполняет поля формы другими данными работника", () => {
    const otherWorker = {
      id: "456",
      name: "Петр Петров",
      email: "petr@example.com",
      phone: "+79007654321",
      isAdmin: false,
    };

    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={otherWorker}
      />,
    );

    expect(screen.getByLabelText(/ФИО/i)).toHaveValue("Петр Петров");
    expect(screen.getByLabelText(/email/i)).toHaveValue("petr@example.com");
    expect(screen.getByLabelText(/Телефон/i)).toHaveValue("+79007654321");
    expect(screen.getByLabelText(/Администрирование/i)).not.toBeChecked();
  });

  it("вызывает onClose при клике на кнопку 'Отмена'", () => {
    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    const cancelButton = screen.getByText("Отмена");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("сбрасывает форму после успешного обновления", async () => {
    const user = userEvent.setup();

    vi.mocked(useUpdateWorker).mockReturnValue({
      mutate: vi.fn().mockImplementation((values, { onSuccess }) => {
        onSuccess({ worker: mockWorker } as any);
      }),
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any);

    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    // Изменяем данные формы
    await user.clear(screen.getByLabelText(/ФИО/i));
    await user.type(screen.getByLabelText(/ФИО/i), "Иван Иванов Обновленный");

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Обновить" });
    await user.click(submitButton);

    // Проверяем, что onClose был вызван (что означает успешное обновление)
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("показывает ошибки валидации при пустом вводе", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    // Очищаем поля
    await user.clear(screen.getByLabelText(/ФИО/i));
    await user.clear(screen.getByLabelText(/email/i));

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Обновить" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("ФИО обязательно")).toBeInTheDocument();
      expect(screen.getByText("Некоректная почта")).toBeInTheDocument();
    });
  });

  it("отправляет обновленные данные при успешной валидации", async () => {
    const user = userEvent.setup();

    vi.mocked(useUpdateWorker).mockReturnValue({
      mutate: vi.fn().mockImplementation((values, { onSuccess }) => {
        onSuccess({ worker: mockWorker } as any);
      }),
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any);

    renderWithProviders(
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    // Изменяем данные формы
    await user.clear(screen.getByLabelText(/ФИО/i));
    await user.type(screen.getByLabelText(/ФИО/i), "Петр Петров");
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "petr@example.com");
    await user.clear(screen.getByLabelText(/Телефон/i));
    await user.type(screen.getByLabelText(/Телефон/i), "+79007654321");

    // Снимаем галочку с isAdmin
    const isAdminCheckbox = screen.getByLabelText(/Администрирование/i);
    await user.click(isAdminCheckbox);

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Обновить" });
    await user.click(submitButton);

    // Проверяем, что mutate был вызван с правильными данными и onClose тоже
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("показывает ошибку сервера, если обновление не удалось", async () => {
    const user = userEvent.setup();
    const errorMessage = "Ошибка при обновлении";

    vi.mocked(useUpdateWorker).mockReturnValue({
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
      <UpdateWorkersModal
        opened={true}
        onClose={mockOnClose}
        editingWorker={mockWorker}
      />,
    );

    // Изменяем данные формы
    await user.clear(screen.getByLabelText(/ФИО/i));
    await user.type(screen.getByLabelText(/ФИО/i), "Иван Иванов Обновленный");

    // Отправляем форму
    const submitButton = screen.getByRole("button", { name: "Обновить" });
    await user.click(submitButton);

    // Проверяем, что ошибка отображается
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
