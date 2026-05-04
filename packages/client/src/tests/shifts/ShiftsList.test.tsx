// packages/client/src/pages/shiftsPage/ShiftsList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import { ShiftsList } from "../../pages/shiftsPage/ShiftsList";
import type { ShiftFromDB } from "shared";

// Mock dayjs
vi.mock("dayjs", () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => "01.01.2023 10:00"),
  })),
}));

const mockShifts: ShiftFromDB[] = [
  {
    id: "1",
    worker: { id: "w1", name: "Иван Иванов" },
    startTime: new Date("2023-01-01T10:00:00Z"),
    endTime: new Date("2023-01-01T18:00:00Z"),
  },
  {
    id: "2",
    worker: { id: "w2", name: "Петр Петров" },
    startTime: new Date("2023-01-02T10:00:00Z"),
    endTime: new Date("2023-01-02T18:00:00Z"),
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("ShiftsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает сообщение о отсутствии смен при пустом массиве", () => {
    renderWithProviders(
      <ShiftsList
        ShiftsData={[]}
        openEditModal={vi.fn()}
        handleDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Нет смен за выбранный период"),
    ).toBeInTheDocument();
  });

  it("отображает таблицу со сменами", () => {
    renderWithProviders(
      <ShiftsList
        ShiftsData={mockShifts}
        openEditModal={vi.fn()}
        handleDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    expect(screen.getByText("Петр Петров")).toBeInTheDocument();
    expect(screen.getAllByText("01.01.2023 10:00")).toHaveLength(4); // start and end for each
  });

  it("вызывает openEditModal при клике на кнопку редактирования", () => {
    const openEditModal = vi.fn();

    renderWithProviders(
      <ShiftsList
        ShiftsData={mockShifts}
        openEditModal={openEditModal}
        handleDelete={vi.fn()}
      />,
    );

    const editButtons = screen.getAllByRole("button", { name: "edit" });
    fireEvent.click(editButtons[0]);

    expect(openEditModal).toHaveBeenCalledWith(mockShifts[0]);
  });

  it("вызывает handleDelete при клике на кнопку удаления", () => {
    const handleDelete = vi.fn();

    renderWithProviders(
      <ShiftsList
        ShiftsData={mockShifts}
        openEditModal={vi.fn()}
        handleDelete={handleDelete}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
