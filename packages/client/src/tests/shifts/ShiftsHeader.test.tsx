import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { MantineProvider } from "@mantine/core";
import { ShiftsHeader } from "src/pages/shiftsPage/ShiftsHeader";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("ShiftsHeader", () => {
  const mockOpenDateModal = vi.fn();
  const mockOpenCreateModal = vi.fn();
  const mockFormatDate = vi.fn().mockReturnValue("1 января 2023");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает заголовок 'Смены'", () => {
    renderWithProviders(
      <ShiftsHeader
        openDateModal={mockOpenDateModal}
        formatDate={mockFormatDate}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    expect(screen.getByText("Смены")).toBeInTheDocument();
  });

  it("отображает отформатированную дату", () => {
    renderWithProviders(
      <ShiftsHeader
        openDateModal={mockOpenDateModal}
        formatDate={mockFormatDate}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    expect(screen.getByText("1 января 2023")).toBeInTheDocument();
  });

  it("вызывает openDateModal при клике на кнопку даты", () => {
    renderWithProviders(
      <ShiftsHeader
        openDateModal={mockOpenDateModal}
        formatDate={mockFormatDate}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const dateButton = screen.getByText("1 января 2023");
    fireEvent.click(dateButton);

    expect(mockOpenDateModal).toHaveBeenCalledTimes(1);
  });

  it("вызывает openCreateModal при клике на кнопку 'Добавить'", () => {
    renderWithProviders(
      <ShiftsHeader
        openDateModal={mockOpenDateModal}
        formatDate={mockFormatDate}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const addButton = screen.getByText("Добавить");
    fireEvent.click(addButton);

    expect(mockOpenCreateModal).toHaveBeenCalledTimes(1);
  });
});