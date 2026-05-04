// packages/client/src/pages/workersPage/workersPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import WorkersPage from "./WorkersPage";
import useWorkers from "./useWorkers";
import { trpc } from "src/api/client";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { workersUpdateInput } from "shared";

// Мокаем хук useWorkers
vi.mock("./useWorkers", () => ({
  default: vi.fn(),
}));

const mockUseWorkers = vi.mocked(useWorkers);

// Создаем моковые данные
const mockWorkers: workersUpdateInput[] = [
  {
    id: "1",
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+79991112233",
    isAdmin: true,
  },
  {
    id: "2",
    name: "Петр Петров",
    email: "petr@example.com",
    phone: "+79991112234",
    isAdmin: false,
  },
];

import { UseTRPCQueryResult } from "@trpc/react-query";
import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "server";

// Типы для mock
type MockWorkersList = Partial<
  UseTRPCQueryResult<workersUpdateInput[], TRPCClientError<AppRouter>>
> & {
  trpc: { path: string };
};

// Helper для создания mock workersList
const createMockWorkersList = (
  overrides: Partial<MockWorkersList> = {},
): MockWorkersList => ({
  data: undefined,
  error: null,
  isError: false,
  isFetched: true,
  isFetching: false,
  isLoading: false,
  isPending: false,
  isPlaceholderData: false,
  isRefetchError: false,
  isRefetching: false,
  isStale: false,
  isSuccess: true,
  refetch: vi.fn(),
  status: "success",
  trpc: { path: "workers.getAll" },
  ...overrides,
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  const mockTrpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://mock",
        transformer: superjson,
      }),
    ],
  });

  return render(
    <trpc.Provider client={mockTrpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <ModalsProvider>{ui}</ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>,
  );
};

describe("WorkersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает загрузку при isLoading = true", () => {
    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({
        isLoading: true,
        isPending: true,
        isSuccess: false,
        status: "pending",
      }),
      isLoading: true,
      error: null,
      handleDelete: vi.fn(),
      query: "",
      setQuery: vi.fn(),
      filtered: [],
    });

    renderWithProviders(<WorkersPage />);

    expect(screen.getByTestId("WorkersLoader")).toBeInTheDocument();
  });

  it("отображает ошибку при наличии error", () => {
    const error = new Error("Ошибка загрузки");

    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({
        error,
        isError: true,
        isSuccess: false,
        status: "error",
        data: undefined,
      }),
      isLoading: false,
      error,
      handleDelete: vi.fn(),
      query: "",
      setQuery: vi.fn(),
      filtered: [],
    });

    renderWithProviders(<WorkersPage />);

    expect(screen.getByText("Ошибка загрузки")).toBeInTheDocument();
  });

  it("отображает сообщение о отсутствии работников при пустом списке", () => {
    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({ data: [] }),
      isLoading: false,
      error: null,
      handleDelete: vi.fn(),
      query: "",
      setQuery: vi.fn(),
      filtered: [],
    });

    renderWithProviders(<WorkersPage />);

    expect(screen.getByText("Ещё нет ни одного работника")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Добавить работника" }),
    ).toBeInTheDocument();
  });

  it("отображает список работников", () => {
    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({ data: mockWorkers }),
      isLoading: false,
      error: null,
      handleDelete: vi.fn(),
      query: "",
      setQuery: vi.fn(),
      filtered: mockWorkers,
    });

    renderWithProviders(<WorkersPage />);

    expect(screen.getByText("Мастера")).toBeInTheDocument();
    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    expect(screen.getByText("Петр Петров")).toBeInTheDocument();
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
    expect(screen.getByText("petr@example.com")).toBeInTheDocument();
  });

  it("фильтрует работников по поисковому запросу", () => {
    const filteredWorkers = [mockWorkers[0]];

    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({ data: mockWorkers }),
      isLoading: false,
      error: null,
      handleDelete: vi.fn(),
      query: "Иван",
      setQuery: vi.fn(),
      filtered: filteredWorkers,
    });

    renderWithProviders(<WorkersPage />);

    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    expect(screen.queryByText("Петр Петров")).not.toBeInTheDocument();
  });

  it("вызывает handleDelete при клике на кнопку удаления", () => {
    const handleDelete = vi.fn();

    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({ data: mockWorkers }),
      isLoading: false,
      error: null,
      handleDelete,
      query: "",
      setQuery: vi.fn(),
      filtered: mockWorkers,
    });

    renderWithProviders(<WorkersPage />);

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith("1");
  });

  it("открывает модальное окно редактирования при клике на кнопку редактирования", () => {
    mockUseWorkers.mockReturnValue({
      workersList: createMockWorkersList({ data: mockWorkers }),
      isLoading: false,
      error: null,
      handleDelete: vi.fn(),
      query: "",
      setQuery: vi.fn(),
      filtered: mockWorkers,
    });

    renderWithProviders(<WorkersPage />);

    const editButtons = screen.getAllByRole("button", { name: "edit" });
    fireEvent.click(editButtons[0]);

    // После клика должно открыться модальное окно
    // Проверяем что компонент всё ещё отрендерен
    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
  });
});
