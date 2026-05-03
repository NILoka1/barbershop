import { Stack, TextInput } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { ShiftsList } from "./ShiftsList";
import { ShiftsHeader } from "./ShiftsHeader";
import { useDateModal } from "../../components/DateModall";
import { trpc } from "src/main";
import { IconSearch } from "@tabler/icons-react";
import { useSearch } from "src/utils/useSearch";
import { filterServices } from "src/utils/searchers/filterShifts";
import { ShiftCreateModal } from "../DashboardPage/Shift/ShiftCreateModal";
import type { ShiftFromDB } from "shared";
import { useDeleteShift } from "src/api/shifts/delete";
import { confirmModal } from "src/utils/confirmModals";

export const ShiftsPage = () => {
  const { openDateModal, formatDate, getDateRange } = useDateModal();
  const ShiftsData = trpc.shifts.getInDateRange.useQuery(getDateRange()).data;
  const { query, setQuery, filtered } = useSearch(ShiftsData, filterServices);

  const [modal, setModal] = useState<{
    type: "edit" | "create";
    item: ShiftFromDB | null;
  } | null>(null);

  const deleteService = useDeleteShift(getDateRange());
  const handleDelete = useCallback(async (id: string) => {
    confirmModal("Вы действительно хотите удалить эту услугу?", () =>
      deleteService.mutate({ id: id }),
    );
  }, []);

  const openEditModal = useCallback((item: ShiftFromDB) => {
    setModal({ type: "edit", item });
  }, []);

  const openCreateModal = useCallback(() => {
    setModal({ type: "create", item: null });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <>
      <Stack align="center">
        <ShiftsHeader
          openDateModal={openDateModal}
          formatDate={formatDate}
          openCreateModal={openCreateModal}
        />
        <TextInput
          placeholder="Поиск по услугам..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={"100%"}
        />
        <ShiftsList ShiftsData={filtered} openEditModal={openEditModal} handleDelete={handleDelete} />
      </Stack>
      <ShiftCreateModal
        modal={modal}
        close={closeModal}
        currentMonth={getDateRange()}
      />
    </>
  );
};
