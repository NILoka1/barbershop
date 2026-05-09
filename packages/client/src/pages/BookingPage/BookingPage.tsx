import { Stack } from "@mantine/core";
import React, { useCallback, useState } from "react";
import BookingHeader from "./BookingHeader";
import BookingList from "./BookingList";
import { useDateModal } from "src/components/DateModall";
import type { BookingFromDB } from "shared";
import { BookingModal } from "../DashboardPage/Booking/BookingModal";
import { trpc } from "src/api/client";
import { confirmModal } from "src/utils/confirmModals";
import { useDeleteBooking } from "src/api/booking/delete";

export const BookingPage = () => {
  const { openDateModal, formatDate, getDateRange } = useDateModal();
  const [modal, setModal] = useState<{
    type: "edit" | "create";
    item: BookingFromDB | null;
  } | null>(null);

  const BookingData = trpc.booking.getByDay.useQuery(getDateRange()).data;
  const dayDatail = trpc.shifts.getInDateRange.useQuery(getDateRange()).data;

  const deleteService = useDeleteBooking(getDateRange());
  const handleDelete = useCallback(
    async (id: string) => {
      confirmModal("Вы действительно хотите удалить эту запись?", () =>
        deleteService.mutate({ id: id }),
      );
    },
    [deleteService],
  );

  const openEditModal = useCallback((item: BookingFromDB) => {
    setModal({ type: "edit", item });
  }, []);

  const openCreateModal = useCallback(() => {
    setModal({ type: "create", item: null });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  if (!dayDatail) {
    return null;
  }
  return (
    <>
      <Stack align="center">
        <BookingHeader
          openDateModal={openDateModal}
          formatDate={formatDate}
          openCreateModal={openCreateModal}
        />
        <BookingList
          openEditModal={openEditModal}
          BookingData={BookingData}
          handleDelete={handleDelete}
        />
      </Stack>
      {modal && (
        <BookingModal
          dateRange={getDateRange()}
          modal={modal}
          close={closeModal}
          dayDatail={dayDatail}
        />
      )}
    </>
  );
};
