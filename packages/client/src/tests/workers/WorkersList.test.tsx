// packages/client/src/pages/workersPage/WorkersList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import { WorkersList } from "../../pages/workersPage/WorkersList";
import type { workersUpdateInput } from "shared";

const mockWorkers: workersUpdateInput[] = [
  {
    id: "1",
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "1234567890",
    isAdmin: true,
  },
  {
    id: "2",
    name: "Петр Петров",
    email: "petr@example.com",
    phone: "0987654321",
    isAdmin: false,
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("WorkersList", () => {
  const mockHandleDelete = vi.fn();
  const mockOpenEditModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает сообщение о отсутствии мастеров при пустом массиве", () => {
    renderWithProviders(
      <WorkersList
        workers={[]}
        handleDelete={mockHandleDelete}
        openEditModal={mockOpenEditModal}
      />,
    );

    expect(screen.getByText("Нет мастеров для отображения")).toBeInTheDocument();
  });

  it("отображает таблицу с мастерами", () => {
    renderWithProviders(
      <WorkersList
        workers={mockWorkers}
        handleDelete={mockHandleDelete}
        openEditModal={mockOpenEditModal}
      />,
    );

    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Да")).toBeInTheDocument();

    expect(screen.getByText("Петр Петров")).toBeInTheDocument();
    expect(screen.getByText("petr@example.com")).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
    expect(screen.getAllByText("Нет")).toHaveLength(1);
  });

  it("вызывает openEditModal при клике на кнопку редактирования", () => {
    renderWithProviders(
      <WorkersList
        workers={mockWorkers}
        handleDelete={mockHandleDelete}
        openEditModal={mockOpenEditModal}
      />,
    );

    const editButtons = screen.getAllByRole("button", { name: "edit" });
    fireEvent.click(editButtons[0]);

    expect(mockOpenEditModal).toHaveBeenCalledWith(mockWorkers[0]);
  });

  it("вызывает handleDelete при клике на кнопку удаления", () => {
    renderWithProviders(
      <WorkersList
        workers={mockWorkers}
        handleDelete={mockHandleDelete}
        openEditModal={mockOpenEditModal}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    fireEvent.click(deleteButtons[0]);

    expect(mockHandleDelete).toHaveBeenCalledWith("1");
  });
});