import { Paper, Tabs, Button, Text } from "@mantine/core";
import React, { useState } from "react";
import type { BookingFromDB, ShiftFromDB } from "shared";
import { IconClock, IconCalendar } from "@tabler/icons-react";
import { confirmModal } from "src/utils/confirmModals";
import { useDeleteShift } from "src/api/shifts/delete";
import { ShiftsList } from "./Shift/ShiftsList";
import BookingList from "./Booking/BookingList";
import { useDeleteBooking } from "src/api/booking/delete";

interface ShiftMenuProps {
  dayDatail: ShiftFromDB[];
  currentMonth: {
    startDate: string;
    endDate: string;
  };
  onEdit: (shift: ShiftFromDB) => void;
  onCreate: () => void;
  onOpenBookingModal: () => void;
  onOpenEditBookingModal: (item: BookingFromDB) => void;
}

export const DashboardMenu = React.memo(
  ({
    dayDatail,
    currentMonth,
    onEdit,
    onCreate,
    onOpenBookingModal,
    onOpenEditBookingModal
  }: ShiftMenuProps) => {
    const [activeTab, setActiveTab] = useState<string | null>("shifts");
    const deleteShift = useDeleteShift(currentMonth);
    const handleDelete = (id: string) => {
      confirmModal("Вы действительно хотите удалить эту смену", () => {
        deleteShift.mutate({ id: id });
      });
    };

    const deleteBooking = useDeleteBooking(currentMonth);
    const handleDeleteBooking = (id: string) => {
      confirmModal("Вы действительно хотите удалить эту запись", () => {
        deleteBooking.mutate({ id: id });
      });
    }

    if (!dayDatail || dayDatail.length === 0) {
      return (
        <>
          <Paper withBorder shadow="md" w="100%" h="100%" p="md">
            <Text ta="center">Нет данных для выбранного дня</Text>
            <Button mb="sm" w={"100%"} onClick={onCreate}>
              Добавить смену
            </Button>
          </Paper>
        </>
      );
    }

    return (
      <>
        <Paper withBorder shadow="md" w="100%" h="100%" p="md">
          <Tabs value={activeTab} onChange={setActiveTab} h={"100%"}>
            <Tabs.List justify="center">
              <Tabs.Tab value="shifts" leftSection={<IconClock size={16} />}>
                Смены
              </Tabs.Tab>
              <Tabs.Tab
                value="bookings"
                leftSection={<IconCalendar size={16} />}
              >
                Записи
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="shifts" pt="sm" h={"80%"}>
              <Button mb="sm" w={"100%"} onClick={onCreate}>
                Добавить смену
              </Button>
              <ShiftsList
                dayDatail={dayDatail}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            </Tabs.Panel>

            <Tabs.Panel value="bookings" pt="md">
              <Button onClick={onOpenBookingModal} mb="md" w={"100%"}>
                Добавить запись
              </Button>
              <BookingList
                dayDatail={dayDatail}
                onOpenBookingModal={onOpenEditBookingModal}
                onDelete={handleDeleteBooking}
              />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </>
    );
  },
);
