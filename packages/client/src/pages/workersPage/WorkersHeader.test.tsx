// packages/client/src/pages/workersPage/WorkersHeader.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import { WorkersHeader } from "./WorkersHeader";
import * as hooks from "@mantine/hooks";

// Мокаем хук useMediaQuery
vi.mock("@mantine/hooks");
const { useMediaQuery } = vi.hoisted(() => ({
  useMediaQuery: vi.fn(),
}));

vi.mocked(hooks).useMediaQuery = useMediaQuery;

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("WorkersHeader", () => {
  const mockSetQuery = vi.fn();
  const mockOpenCreateModal = vi.fn();
  const defaultProps = {
    query: "",
    setQuery: mockSetQuery,
    openCreateModal: mockOpenCreateModal,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает заголовок 'Мастера'", () => {
    renderWithProviders(<WorkersHeader {...defaultProps} />);

    expect(screen.getByText("Мастера")).toBeInTheDocument();
  });

  it("отображает кнопку 'Добавить мастера'", () => {
    renderWithProviders(<WorkersHeader {...defaultProps} />);

    expect(screen.getByText("Добавить мастера")).toBeInTheDocument();
  });

  it("вызывает openCreateModal при клике на кнопку 'Добавить мастера'", () => {
    renderWithProviders(<WorkersHeader {...defaultProps} />);

    const addButton = screen.getByText("Добавить мастера");
    fireEvent.click(addButton);

    expect(mockOpenCreateModal).toHaveBeenCalledTimes(1);
  });

  it("отображает поле поиска на десктопе", () => {
    // Мокаем, что экран не мобильный
    useMediaQuery.mockReturnValue(false);

    renderWithProviders(<WorkersHeader {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Поиск по мастерам..."),
    ).toBeInTheDocument();
  });

  it("не отображает поле поиска на мобильных устройствах", () => {
    // Мокаем, что экран мобильный
    useMediaQuery.mockReturnValue(true);

    renderWithProviders(<WorkersHeader {...defaultProps} />);

    expect(
      screen.queryByPlaceholderText("Поиск по мастерам..."),
    ).not.toBeInTheDocument();
  });

  it("вызывает setQuery при вводе текста в поле поиска", () => {
    useMediaQuery.mockReturnValue(false);

    renderWithProviders(<WorkersHeader {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Поиск по мастерам...");
    fireEvent.change(searchInput, { target: { value: "Иван" } });

    expect(mockSetQuery).toHaveBeenCalledWith("Иван");
  });
});
