import { Flex } from "@mantine/core";
import dayjs from "dayjs";
import { useShiftsPage } from "./useShaitsPage";
import { ShiftMenu } from "./ShiftMenu";
import { useCallback, useState } from "react";
import type { ShiftFromDB } from "shared";
import { CreateShiftModal } from "./CreateShiftModal";
import ShiftCalendar from "./ShiftCalendar";

export const ShiftsPage = () => {
  const {
    selected,
    currentMonth,
    handleDateChange,
    dayDetail,
    handleSetSelected,
  } = useShiftsPage();

  const [modal, setModal] = useState<{
    type: "edit" | "create";
    item: ShiftFromDB | null;
  } | null>(null);

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
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "center", sm: "flex-start" }}
        h="100%"
      >
        <ShiftCalendar
          handleDateChange={handleDateChange}
          selected={selected}
          setSelected={handleSetSelected}
        />
        <Flex w={{ base: "90%", sm: "40%" }} h={"100%"}>
          <ShiftMenu
            dayDatail={dayDetail}
            currentMonth={currentMonth}
            onEdit={openEditModal}
            onCreate={openCreateModal}
          />
        </Flex>
      </Flex>
      <CreateShiftModal
        currentMonth={currentMonth}
        date={dayjs(selected).format("YYYY-MM-DD")}
        modal={modal}
        close={closeModal}
      />
    </>
  );
};
