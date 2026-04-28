import { Flex } from "@mantine/core";
import dayjs from "dayjs";
import { useShiftsPage } from "./useShaitsPage";
import { DashboardMenu } from "./DashboardMenu";
import { useCallback, useState } from "react";
import type { BookingFromDB, ShiftFromDB } from "shared";
import { ShiftCreateModal } from "./Shift/ShiftCreateModal";
import ShiftCalendar from "./Shift/ShiftCalendar";
import { BookingModal } from "./Booking/BookingModal";

export const DashboardPage = () => {
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

  const [BookingModalData, setBookingModal] = useState<{
    type: "edit" | "create";
    item: BookingFromDB | null;
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

  const openBookingModal = useCallback(() => {
    setBookingModal({ type: "create", item: null });
  }, []);

  const openEditBookingModal = useCallback((item: BookingFromDB) => {
    setBookingModal({ type: "edit", item });
    console.log(item);
  }, []);

  const closeBookingModal = useCallback(() => {
    setBookingModal(null);
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
          <DashboardMenu
            dayDatail={dayDetail}
            currentMonth={currentMonth}
            onEdit={openEditModal}
            onCreate={openCreateModal}
            onOpenBookingModal={openBookingModal}
            onOpenEditBookingModal ={openEditBookingModal}
          />
        </Flex>
      </Flex>
      <ShiftCreateModal
        currentMonth={currentMonth}
        date={dayjs(selected).format("YYYY-MM-DD")}
        modal={modal}
        close={closeModal}
      />
      <BookingModal
        dayDatail={dayDetail}
        date={dayjs(selected).format("YYYY-MM-DD")}
        modal={BookingModalData}
        close={closeBookingModal}
      />
    </>
  );
};
